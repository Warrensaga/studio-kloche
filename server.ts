import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { prisma } from "./src/lib/prisma";
import { sendEnquiryEmail } from "./src/lib/email";
import { enquirySchema, clientSchema, appointmentSchema } from "./src/lib/validations";

const app = express();
const PORT = 3000;

app.use(express.json());

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

    // Send email dispatch via Nodemailer
    await sendEnquiryEmail(data);

    res.status(201).json({ success: true, id: enquiry.id });
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
      },
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

    const client = await prisma.client.update({
      where: { id },
      data,
    });
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update client" });
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

startServer();
