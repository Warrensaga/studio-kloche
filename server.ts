import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import bcrypt from "bcryptjs";
import { prisma } from "./src/lib/prisma";
import { sendEnquiryEmail, sendClientUpdateEmail } from "./src/lib/email";
import { enquirySchema, clientSchema, appointmentSchema } from "./src/lib/validations";
import { sanitizeData } from "./src/lib/sanitizer";

const app = express();
const PORT = 3000;

app.use(express.json());

// Global input sanitization middleware to recursively sanitize and trim all incoming body and query fields
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeData(req.body);
  }
  if (req.query) {
    req.query = sanitizeData(req.query);
  }
  next();
});

// In-Memory Rate Limiting for Authentication Endpoints
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const authRateLimits = new Map<string, RateLimitRecord>();

function createAuthRateLimiter(windowMs: number, maxRequests: number, message: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.ip || req.headers["x-forwarded-for"] || "unknown_ip") as string;
    const now = Date.now();
    const record = authRateLimits.get(ip);

    if (!record) {
      authRateLimits.set(ip, {
        count: 1,
        resetAt: now + windowMs,
      });
      next();
      return;
    }

    if (now > record.resetAt) {
      record.count = 1;
      record.resetAt = now + windowMs;
      next();
      return;
    }

    record.count += 1;
    if (record.count > maxRequests) {
      const waitTimeSeconds = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader("Retry-After", waitTimeSeconds.toString());
      res.status(429).json({
        error: `${message} Try again in ${waitTimeSeconds} seconds.`
      });
      return;
    }

    next();
  };
}

// Allow max 10 requests within a 1-minute window
const authRateLimitMiddleware = createAuthRateLimiter(
  60 * 1000, 
  10, 
  "Too many authentication requests from this IP address."
);

// API: AUTHENTICATION (SIGN IN & SIGN UP)

// GET /api/auth/admins-count - check if any admin accounts exist
app.get("/api/auth/admins-count", async (req: Request, res: Response) => {
  try {
    const count = await prisma.admin.count();
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to count administrators" });
  }
});

// POST /api/auth/signup - register a new admin account
app.post("/api/auth/signup", authRateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Username, email, and password are required" });
      return;
    }

    if (username.length < 3 || password.length < 6) {
      res.status(400).json({ error: "Username must be at least 3 characters and password must be at least 6 characters" });
      return;
    }

    // Check if admin already exists by username or email
    const existing = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { email: email.trim().toLowerCase() }
        ]
      }
    });

    if (existing) {
      res.status(400).json({ error: "Username or email is already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      }
    });

    res.status(201).json({
      success: true,
      user: { id: admin.id, username: admin.username, email: admin.email }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to register administrator" });
  }
});

// POST /api/auth/signin - log in an existing admin account
app.post("/api/auth/signin", authRateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body; // login can be either email or username

    if (!login || !password) {
      res.status(400).json({ error: "Email/Username and password are required" });
      return;
    }

    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: login.trim() },
          { email: login.trim().toLowerCase() }
        ]
      }
    });

    if (!admin) {
      res.status(401).json({ error: "Invalid email, username, or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email, username, or password" });
      return;
    }

    res.json({
      success: true,
      user: { id: admin.id, username: admin.username, email: admin.email }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to authenticate administrator" });
  }
});

// Temporary in-memory database of password reset authorizations
interface ResetRecord {
  code: string;
  expiresAt: number;
}
const resetCodes = new Map<string, ResetRecord>();

// POST /api/auth/forgot-password - Dispatch password reset authorization code
app.post("/api/auth/forgot-password", authRateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email address is required to proceed" });
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!admin) {
      res.status(404).json({ error: "No administrative profile matching this email registration." });
      return;
    }

    // Generate high-quality 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes.set(admin.email, {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000 // Valid for 15 minutes
    });

    console.log(`[SECURITY ENVELOPE - KLOCHE RESET PIN]: Target="${admin.email}" ResetCode="${code}"`);

    res.json({
      success: true,
      message: "An authorization code has been dispatched. For secure local preview, your active reset code is provided below.",
      code // Returned so developer can instantly copy/test without setting up an external mail daemon
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Credential reset dispatch failed" });
  }
});

// POST /api/auth/reset-password - Redeem reset token and update database credentials
app.post("/api/auth/reset-password", authRateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      res.status(400).json({ error: "All attributes (email, code, password) are mandatory" });
      return;
    }

    const targetEmail = email.trim().toLowerCase();
    const activeCode = code.trim();
    const entry = resetCodes.get(targetEmail);

    if (!entry) {
      res.status(400).json({ error: "No inactive request associated with this email profile." });
      return;
    }

    if (entry.expiresAt < Date.now()) {
      resetCodes.delete(targetEmail);
      res.status(400).json({ error: "Password authorization code has expired. Request a new token." });
      return;
    }

    if (entry.code !== activeCode) {
      res.status(400).json({ error: "Invalid credit code. Please recheck your secure inbox/logs." });
      return;
    }

    // Update password inside SQLite database safely
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { email: targetEmail },
      data: { password: hashedPassword }
    });

    // Revoke code to avoid replay attacks
    resetCodes.delete(targetEmail);

    res.json({
      success: true,
      message: "Administrator credentials successfully synchronized to the database."
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update security credentials" });
  }
});

// API: ENQUIRIES

// GET /api/enquiries
app.get("/api/enquiries", async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const whereClause = status ? { status: status as string } : {};
    
    const enquiries = await prisma.enquiry.findMany({
      where: whereClause,
      include: {
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(enquiries);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch enquiries" });
  }
});

// POST /api/enquiries
app.post("/api/enquiries", async (req: Request, res: Response) => {
  try {
    const data = enquirySchema.parse(req.body);
    
    // Check if a client with this phone number already exists
    let existingClient = await prisma.client.findFirst({
      where: {
        phone: data.phone,
      },
    });

    // Save of enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        service: data.service,
        message: data.message,
        clientId: existingClient?.id || null,
      },
    });

    // Send email dispatch via multi-carrier agent (Resend + Fallbacks)
    const emailDispatchResult = await sendEnquiryEmail(data);

    res.status(201).json({ 
      success: true, 
      id: enquiry.id,
      emailStatus: emailDispatchResult
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message || "Failed to submit enquiry" });
    }
  }
});

// PATCH /api/enquiries/:id
app.patch("/api/enquiries/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !["new", "read", "replied"].includes(status)) {
      res.status(400).json({ error: "Invalid status value" });
      return;
    }

    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: { status },
    });
    res.json(enquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update enquiry" });
  }
});


// API: CLIENTS

// GET /api/clients
app.get("/api/clients", async (req: Request, res: Response) => {
  try {
    const { search, status } = req.query;
    
    let whereClause: any = {};
    if (status && status !== "all") {
      whereClause.status = status as string;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search as string } },
        { phone: { contains: search as string } },
        { email: { contains: search as string } },
      ];
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            enquiries: true,
            appointments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(clients);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch clients" });
  }
});

// POST /api/clients
app.post("/api/clients", async (req: Request, res: Response) => {
  try {
    const data = clientSchema.parse(req.body);
    
    const client = await prisma.client.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        notes: data.notes || null,
        status: data.status,
        consultancyHours: data.consultancyHours || 0,
        completionRate: data.completionRate || 0,
      },
    });

    // Create initial tracking history
    await prisma.statusHistory.create({
      data: {
        clientId: client.id,
        oldStatus: "None",
        newStatus: data.status,
      }
    });

    res.status(201).json(client);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message || "Failed to create client" });
    }
  }
});

// GET /api/clients/:id
app.get("/api/clients/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        enquiries: {
          orderBy: { createdAt: "desc" },
        },
        appointments: {
          orderBy: { date: "asc" },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
        todos: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch client details" });
  }
});

// PATCH /api/clients/:id
app.patch("/api/clients/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = clientSchema.partial().parse(req.body);

    const existingClient = await prisma.client.findUnique({
      where: { id }
    });

    if (existingClient && data.status && existingClient.status !== data.status) {
      await prisma.statusHistory.create({
        data: {
          clientId: id,
          oldStatus: existingClient.status,
          newStatus: data.status,
        }
      });
    }

    const client = await prisma.client.update({
      where: { id },
      data,
    });
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update client" });
  }
});

// POST /api/clients/:id/send-update-email
app.post("/api/clients/:id/send-update-email", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, message, status, completionRate } = req.body;

    if (!subject || !message) {
      res.status(400).json({ error: "Subject and Message fields are required" });
      return;
    }

    const client = await prisma.client.findUnique({
      where: { id }
    });

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    if (!client.email) {
      res.status(400).json({ error: "No registered email address exists for this client profile file." });
      return;
    }

    const emailResult = await sendClientUpdateEmail({
      clientName: client.name,
      clientEmail: client.email,
      subject: subject.trim(),
      message: message.trim(),
      status: status || client.status || "lead",
      completionRate: typeof completionRate === "number" ? completionRate : (client.completionRate || 0)
    });

    res.json({ success: true, ...emailResult });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to dispatch project update email" });
  }
});

// DELETE /api/clients/:id
app.delete("/api/clients/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.client.delete({
      where: { id },
    });
    res.json({ success: true, message: "Client deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete client" });
  }
});


// API: TRADING/PINNING INTERNAL CLIENT REMINDERS (TODOS)
app.get("/api/todos", async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });
    res.json(todos);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch internal reminders" });
  }
});

app.post("/api/todos", async (req: Request, res: Response) => {
  try {
    const { content, clientId } = req.body;
    if (!content || content.trim() === "") {
      res.status(400).json({ error: "Reminder content cannot be empty" });
      return;
    }
    const todo = await prisma.todo.create({
      data: {
        content: content.trim(),
        clientId: clientId || null,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    res.status(201).json(todo);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create reminder" });
  }
});

app.patch("/api/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completed, content } = req.body;
    const data: any = {};
    if (completed !== undefined) data.completed = completed;
    if (content !== undefined) data.content = content.trim();

    const todo = await prisma.todo.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    res.json(todo);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update reminder" });
  }
});

app.delete("/api/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({
      where: { id },
    });
    res.json({ success: true, message: "Reminder successfully deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete reminder" });
  }
});



// API: APPOINTMENTS

// GET /api/appointments
app.get("/api/appointments", async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Transform into FullCalendar format
    const events = appointments.map((appt) => {
      // Define colors based on status
      let color = "#B8965A"; // Default Gold (confirmed)
      if (appt.status === "cancelled") {
        color = "#6B6560"; // Muted gray
      } else if (appt.status === "completed") {
        color = "#2E7D32"; // Elegant forest dark-green
      }

      const startDate = new Date(appt.date);
      const endDate = new Date(startDate.getTime() + appt.duration * 60 * 1000);

      return {
        id: appt.id,
        title: `${appt.clientName} - ${appt.service}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        backgroundColor: color,
        borderColor: color,
        textColor: "#FAF8F4",
        extendedProps: {
          clientName: appt.clientName,
          phone: appt.phone,
          service: appt.service,
          status: appt.status,
          notes: appt.notes || "",
          clientId: appt.clientId || "",
          duration: appt.duration,
          date: appt.date,
          appointmentTitle: appt.title,
        },
      };
    });

    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch appointments" });
  }
});

// POST /api/appointments
app.post("/api/appointments", async (req: Request, res: Response) => {
  try {
    const data = appointmentSchema.parse(req.body);
    
    // Check if the date is parseable
    const scheduleDate = new Date(data.date);
    if (isNaN(scheduleDate.getTime())) {
      res.status(400).json({ error: "Invalid date value" });
      return;
    }

    // Try linking of client by explicit clientId or matching phone
    let finalClientId = data.clientId || null;
    if (!finalClientId) {
      const parentClient = await prisma.client.findFirst({
        where: { phone: data.phone },
      });
      if (parentClient) {
        finalClientId = parentClient.id;
      }
    }

    const appointment = await prisma.appointment.create({
      data: {
        title: data.title,
        clientName: data.clientName,
        phone: data.phone,
        service: data.service,
        date: scheduleDate,
        duration: data.duration,
        status: data.status,
        notes: data.notes || null,
        clientId: finalClientId || null,
      },
    });

    res.status(201).json(appointment);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message || "Failed to create appointment" });
    }
  }
});

// PATCH /api/appointments/:id
app.patch("/api/appointments/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rawData = appointmentSchema.partial().parse(req.body);

    const updateData: any = { ...rawData };
    if (rawData.date) {
      updateData.date = new Date(rawData.date);
    }

    const appt = await prisma.appointment.update({
      where: { id },
      data: updateData,
    });
    res.json(appt);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update appointment" });
  }
});

// DELETE /api/appointments/:id
app.delete("/api/appointments/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({
      where: { id },
    });
    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete appointment" });
  }
});


// FRONTEND ASSET ROUTING & VITE MIDDLEWARE

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Kloche Interiors full-stack engine online at http://localhost:${PORT}`);
  });
}

// Only run the server process directly if not in Vercel environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
