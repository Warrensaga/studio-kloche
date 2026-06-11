import nodemailer from "nodemailer";

export interface EmailData {
  name: string;
  phone: string;
  email?: string | null;
  service: string;
  message: string;
}

export interface UpdateEmailData {
  clientName: string;
  clientEmail: string;
  subject: string;
  message: string;
  status: string;
  completionRate: number;
}

/**
 * Helper to dispatch an email via Resend's REST API.
 * Uses native fetch for stateless Serverless compatibility on modern CDNs (Vercel, Cloud Run etc.).
 */
export async function sendViaResend(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing from server environment registry");
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  // If using Resend's default onboarding email, we can only send to the account owner.
  // In production, when a domain is verified, any email can be sent safely.
  const payload = {
    from: `Kloche Interiors <${fromEmail}>`,
    to: [to],
    subject: subject,
    html: html,
  };

  console.log(`[RESEND ROUTER] Dispatching payload to: ${to} (Sender: ${fromEmail})`);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json() as any;

  if (!response.ok) {
    const errorMsg = responseData?.message || `HTTP ${response.status} response from Resend`;
    throw new Error(errorMsg);
  }

  return responseData;
}

/**
 * Fallback helper to dispatch an email using traditional SMTP via Nodemailer.
 */
export async function sendViaSmtp(to: string, subject: string, html: string, customFrom?: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Nodemailer SMTP credentials (GMAIL_USER or GMAIL_APP_PASSWORD) not configured");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: user,
      pass: pass,
    },
    connectionTimeout: 5000,
    greetingTimeout: 3000,
    socketTimeout: 5000,
  });

  const mailOptions = {
    from: customFrom || `"Kloche Interiors Web Desk" <${user}>`,
    to: to,
    subject: subject,
    html: html,
  };

  console.log(`[SMTP ROUTER] Dispatching transport to: ${to}`);
  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId };
}

/**
 * Main handler to process a contact form submission (Enquiry).
 * 1. Dispatches formal notification to the studio owner.
 * 2. Optionally dispatches a gorgeous project confirmation receipt to the lead customer.
 */
export async function sendEnquiryEmail(data: EmailData) {
  const owner = process.env.OWNER_EMAIL || "klocheinteriors@gmail.com";
  const apiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.GMAIL_USER;
  const cleanPhone = data.phone.replace(/[^0-9]/g, "");

  // Render Owner Notification Email Template
  const ownerSubject = `✨ New Client Lead: ${data.name} — ${data.service}`;
  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF8F4; padding: 40px; color: #1C1C1A; max-width: 600px; margin: 0 auto; border: 1px solid #E2DDD5;">
      <h2 style="font-family: Georgia, serif; font-size: 26px; line-height: 1.2; color: #0F6051; border-bottom: 2px solid #FAB012; padding-bottom: 15px; margin-bottom: 25px; font-weight: normal; letter-spacing: 0.02em;">
        New Studio Lead Received
      </h2>
      
      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #1C1C1A;">
        A patron has submitted an enquiry using the contact form on your Kloche Interiors website.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2DDD5; font-weight: 500; width: 35%; color: #6B6560;">Client Name:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2DDD5; color: #1C1C1A; font-weight: 500;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2DDD5; font-weight: 500; color: #6B6560;">Phone Number:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2DDD5; color: #1C1C1A;">
            <a href="tel:${data.phone}" style="color: #0F6051; text-decoration: none;">${data.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2DDD5; font-weight: 500; color: #6B6560;">Email Address:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2DDD5; color: #1C1C1A;">${data.email || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2DDD5; font-weight: 500; color: #6B6560;">Requested Service:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #E2DDD5; color: #0F6051; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em;">${data.service}</td>
        </tr>
      </table>

      <div style="background-color: #F5F0E8; padding: 20px; border-left: 4px solid #0F6051; margin-bottom: 30px;">
        <h4 style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 16px; color: #1C1C1A; font-weight: normal; letter-spacing: 0.02em;">Message / Brief:</h4>
        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #4F4F4F; white-space: pre-wrap;">${data.message}</p>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(data.name)}%2C%20thank%20you%20for%20contacting%20Kloche%20Interiors%20regarding%20${encodeURIComponent(data.service)}." style="display: inline-block; background-color: #1C1C1A; color: #FAF8F4; padding: 14px 28px; text-decoration: none; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; border: 1px solid #1C1C1A; text-transform: uppercase;">
          Reach Client on WhatsApp
        </a>
      </div>

      <div style="margin-top: 40px; border-top: 1px solid #E2DDD5; padding-top: 20px; text-align: center; font-size: 11px; color: #6B6560; text-transform: uppercase; letter-spacing: 0.05em;">
        © 2026 Kloche Interiors • Karuna Rd, Nairobi, Kenya
      </div>
    </div>
  `;

  // Render Customer Confirmation Email Template
  const customerSubject = `✨ Project Enquiry Confirmation — Kloche Interiors`;
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF8F4; padding: 40px; color: #1C1C1A; max-width: 600px; margin: 0 auto; border: 1px solid #E2DDD5;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-family: Georgia, serif; font-size: 26px; line-height: 1.2; color: #0F6051; margin-bottom: 5px; font-weight: normal; letter-spacing: 0.05em; text-transform: uppercase;">
          KLOCHE INTERIORS
        </h2>
        <div style="background-color: #FAB012; height: 2px; width: 60px; margin: 0 auto;"></div>
      </div>

      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Hello <strong>${data.name}</strong>,
      </p>

      <p style="font-size: 14px; line-height: 1.6; color: #333333; margin-bottom: 25px;">
        Thank you for submitting your bespoke project details to our studio on Karuna Road. Our principal designer, Keith Locho, and the design team have successfully received your request and will carefully review your brief.
      </p>

      <div style="background-color: #F5F0E8; padding: 20px; border-left: 3px solid #FAB012; margin-bottom: 30px; font-size: 13.5px; line-height: 1.6;">
        <h4 style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 15px; color: #1C1C1A; font-weight: bold; text-transform: uppercase; letter-spacing: 0.02em;">Logged Summary:</h4>
        <div style="margin-bottom: 5px;"><strong>Requested Service:</strong> ${data.service}</div>
        <div style="margin-bottom: 5px;"><strong>Contact Phone:</strong> ${data.phone}</div>
        <div><strong>Recorded Brief:</strong> <span style="font-style: italic; color: #6B6560;">"${data.message || "N/A"}"</span></div>
      </div>

      <p style="font-size: 13.5px; line-height: 1.6; color: #6B6560; margin-bottom: 25px;">
        We strive to return comprehensive conceptual briefs and initial call bookings within 24-48 business hours. If your request is highly time-sensitive, feel free to use the WhatsApp direct link on our website to link directly into our design queue.
      </p>

      <p style="font-size: 14px; line-height: 1.6; margin-bottom: 35px; border-top: 1px solid #E2DDD5; padding-top: 20px;">
        Warmest regards,<br />
        <strong>Keith Locho</strong><br />
        <span style="font-size: 12px; color: #6B6560; text-transform: uppercase; letter-spacing: 0.05em;">Founder & Principal Designer</span>
      </p>

      <div style="border-top: 1px solid #E2DDD5; padding-top: 15px; text-align: center; font-size: 10px; color: #9B9590; text-transform: uppercase; letter-spacing: 0.05em;">
        KLOCHE INTERIORS • KARUNA ROAD, NAIROBI, KENYA
      </div>
    </div>
  `;

  // Unified Sending Logic
  if (apiKey) {
    try {
      console.log("🚀 [EMAIL ENGINE] Primary Carrier selected: RESEND HTTP API");
      
      // Dispatch Owner Notification
      const ownerDispatch = await sendViaResend(owner, ownerSubject, ownerHtml);
      console.log("✅ [RESEND] Owner notification email dispatched:", ownerDispatch.id);

      // Dispatch Customer Confirmation
      let customerDispatch = null;
      if (data.email) {
        try {
          customerDispatch = await sendViaResend(data.email, customerSubject, customerHtml);
          console.log("✅ [RESEND] Customer confirmation email dispatched:", customerDispatch.id);
        } catch (custError: any) {
          console.error("⚠️ [RESEND] Non-blocking failure dispatching customer confirmation receipt:", custError.message || custError);
        }
      }

      return {
        success: true,
        channel: "resend",
        ownerMessageId: ownerDispatch.id,
        customerConfirmationSent: !!customerDispatch
      };
    } catch (err: any) {
      console.error("❌ [RESEND Error] Primary endpoint failed. Routing to SMTP fallback...", err.message || err);
      // Fallback directly to SMTP if SMTP keys are accessible
      if (smtpUser) {
        return await attemptSmtpFallback(owner, ownerSubject, ownerHtml, data, customerSubject, customerHtml);
      }
      return {
        success: false,
        error: `Resend dispatch failed ("${err.message || err}"). Please verify RESEND_API_KEY inside the dashboard settings.`
      };
    }
  } else if (smtpUser) {
    console.log("🚀 [EMAIL ENGINE] No Resend Key. Carrier selected: NODEMAILER GMAIL SMTP");
    return await attemptSmtpFallback(owner, ownerSubject, ownerHtml, data, customerSubject, customerHtml);
  } else {
    // Both carriers are unconfigured -> simulation fallback
    console.log("⚠️ [EMAIL ENGINE] No Email Carriers Configured. Simulating transaction.");
    console.log(`[SIMULATED EMAIL TO OWNER: ${owner}]\nSubject: ${ownerSubject}\nLead Name: ${data.name}`);
    if (data.email) {
      console.log(`[SIMULATED EMAIL TO CLIENT: ${data.email}]\nSubject: ${customerSubject}`);
    }
    return {
      success: false,
      error: "SMTP and Resend APIs are not configured in environment.",
      simulated: true
    };
  }
}

/**
 * Executes fallback dispatching via SMTP
 */
async function attemptSmtpFallback(
  ownerEmail: string,
  ownerSubject: string,
  ownerHtml: string,
  data: EmailData,
  customerSubject: string,
  customerHtml: string
) {
  try {
    const ownerFeedback = await sendViaSmtp(ownerEmail, ownerSubject, ownerHtml);
    console.log("✅ [SMTP Fallback] Successfully sent owner lead alert:", ownerFeedback.messageId);

    let customerFeedback = null;
    if (data.email) {
      try {
        customerFeedback = await sendViaSmtp(data.email, customerSubject, customerHtml);
        console.log("✅ [SMTP Fallback] Successfully sent customer receipt:", customerFeedback.messageId);
      } catch (custSmtpErr: any) {
        console.error("⚠️ [SMTP Fallback] Customer confirmation failed (non-blocking):", custSmtpErr.message || custSmtpErr);
      }
    }

    return {
      success: true,
      channel: "smtp",
      ownerMessageId: ownerFeedback.messageId,
      customerConfirmationSent: !!customerFeedback
    };
  } catch (smtpErr: any) {
    console.error("❌ [SMTP Engine Failure]", smtpErr.message || smtpErr);
    return {
      success: false,
      error: `Both Resend and SMTP channels failed. SMTP Error: "${smtpErr.message || smtpErr}"`
    };
  }
}

/**
 * Handles CRM Client Project Updates.
 * Highly robust using Resend HTTP with secondary SMTP fallback.
 */
export async function sendClientUpdateEmail(data: UpdateEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.GMAIL_USER;

  const subject = data.subject || "Project Status Update — Kloche Interiors";
  const htmlPayload = `
    <div style="font-family: Arial, sans-serif; background-color: #FAF8F4; padding: 40px; color: #1C1C1A; max-width: 600px; margin: 0 auto; border: 1px solid #E2DDD5;">
      <h2 style="font-family: Georgia, serif; font-size: 24px; line-height: 1.2; color: #0F6051; border-bottom: 2px solid #FAB012; padding-bottom: 15px; margin-bottom: 25px; font-weight: normal; letter-spacing: 0.02em; text-transform: uppercase;">
        Studio Project Update
      </h2>
      
      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Hello <strong>${data.clientName}</strong>,
      </p>

      <p style="font-size: 14.5px; line-height: 1.6; color: #2C2C2A; margin-bottom: 25px; white-space: pre-wrap;">
        ${data.message}
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; background-color: #F5F0E8; border-left: 4px solid #FAB012;">
        <tr>
          <td style="padding: 15px; font-weight: 500; width: 40%; color: #6B6560;">Project Status:</td>
          <td style="padding: 15px; color: #1C1C1A; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">${data.status}</td>
        </tr>
        <tr>
          <td style="padding: 15px; font-weight: 500; color: #6B6560;">Project Completion:</td>
          <td style="padding: 15px; color: #0F6051; font-weight: bold;">
            <div style="background-color: #E2DDD5; border-radius: 2px; overflow: hidden; width: 120px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 8px;">
              <div style="background-color: #0F6051; width: ${data.completionRate}%; height: 100%;"></div>
            </div>
            <span style="display: inline-block; vertical-align: middle;">${data.completionRate}%</span>
          </td>
        </tr>
      </table>

      <p style="font-size: 13.5px; line-height: 1.6; color: #6B6560;">
        If you have any questions or would like to schedule an in-person layout sync, please don't hesitate to reply directly to this email or contact us on WhatsApp.
      </p>

      <div style="margin-top: 40px; border-top: 1px solid #E2DDD5; padding-top: 20px; text-align: center; font-size: 11px; color: #6B6560; text-transform: uppercase; letter-spacing: 0.05em;">
        © 2026 Kloche Interiors • Karuna Rd, Nairobi, Kenya
      </div>
    </div>
  `;

  if (apiKey) {
    try {
      console.log("🚀 [CLIENT EMAIL] Primary Carrier selected: RESEND API");
      const result = await sendViaResend(data.clientEmail, subject, htmlPayload);
      return { success: true, messageId: result.id, channel: "resend" };
    } catch (err: any) {
      console.error("❌ [CLIENT EMAIL] Resend channel failed. Routing to SMTP fallback...", err.message || err);
      if (smtpUser) {
        try {
          const fromLabel = `"Keith Locho — Kloche Interiors" <${smtpUser}>`;
          const result = await sendViaSmtp(data.clientEmail, subject, htmlPayload, fromLabel);
          return { success: true, messageId: result.messageId, channel: "smtp" };
        } catch (smtpErr: any) {
          console.error("❌ [CLIENT EMAIL] Core Fallback SMTP failed:", smtpErr.message || smtpErr);
          return { success: false, error: smtpErr.message || smtpErr };
        }
      }
      return { success: false, error: err.message || err };
    }
  } else if (smtpUser) {
    try {
      console.log("🚀 [CLIENT EMAIL] Carrier selected: SMTP");
      const fromLabel = `"Keith Locho — Kloche Interiors" <${smtpUser}>`;
      const result = await sendViaSmtp(data.clientEmail, subject, htmlPayload, fromLabel);
      return { success: true, messageId: result.messageId, channel: "smtp" };
    } catch (smtpErr: any) {
      console.error("❌ [CLIENT EMAIL] SMTP failed:", smtpErr.message || smtpErr);
      return { success: false, error: smtpErr.message || smtpErr };
    }
  } else {
    console.warn("⚠️ SMTP & Resend not configured. Simulating CRM client update dispatch.");
    return { success: true, simulated: true, message: "Carrier credentials absent, update simulated successfully" };
  }
}
