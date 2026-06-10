import nodemailer from "nodemailer";

export interface EmailData {
  name: string;
  phone: string;
  email?: string | null;
  service: string;
  message: string;
}

export async function sendEnquiryEmail(data: EmailData) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const owner = process.env.OWNER_EMAIL || "klocheinteriors@gmail.com";

  if (!user || !pass) {
    console.warn("⚠️ SMTP Credentials (GMAIL_USER / GMAIL_APP_PASSWORD) not configured. Lead logged to DB without SMTP dispatch.");
    return { success: false, error: "SMTP credentials not configured" };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: user,
      pass: pass,
    },
    // Prevent serverless functions from hanging indefinitely
    connectionTimeout: 5000, // 5 seconds
    greetingTimeout: 3000,   // 3 seconds
    socketTimeout: 5000,     // 5 seconds
  });

  // Strip phone non-numeric characters for simple WhatsApp direct link
  const cleanPhone = data.phone.replace(/[^0-9]/g, "");

  const mailOptions = {
    from: `"Kloche Interiors Web Desk" <${user}>`,
    to: owner,
    subject: `✨ New Client Lead: ${data.name} — ${data.service}`,
    html: `
      <div style="font-family: 'Jost', sans-serif; background-color: #FAF8F4; padding: 40px; color: #1C1C1A; max-width: 600px; margin: 0 auto; border: 1px solid #E2DDD5;">
        <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; line-height: 1.2; color: #0F6051; border-bottom: 1px solid #FAB012; padding-bottom: 15px; margin-bottom: 25px; font-weight: normal; letter-spacing: 0.02em;">
          New Studio Lead Received
        </h2>
        
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #1C1C1A;">
          A guest has submitted an enquiry using the contact form on your Kloche Interiors website.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 15px;">
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
            <td style="padding: 12px 0; border-bottom: 1px solid #E2DDD5; color: #0F6051; font-weight: 600; text-transform: uppercase; font-size: 13px; letter-spacing: 0.05em;">${data.service}</td>
          </tr>
        </table>

        <div style="background-color: #F5F0E8; padding: 20px; border-left: 3px solid #0F6051; margin-bottom: 30px;">
          <h4 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #1C1C1A; font-weight: 600; letter-spacing: 0.02em;">Message / Instructions:</h4>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1C1C1A; white-space: pre-wrap;">${data.message}</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(data.name)}%2C%20thank%20you%20for%20contacting%20Kloche%20Interiors%20regarding%20${encodeURIComponent(data.service)}." style="display: inline-block; background-color: #1C1C1A; color: #FAF8F4; padding: 14px 28px; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; border: 1px solid #1C1C1A; text-transform: uppercase;">
            Reach Client on WhatsApp
          </a>
        </div>

        <div style="margin-top: 40px; border-top: 1px solid #E2DDD5; padding-top: 15px; text-align: center; font-size: 11px; color: #6B6560; text-transform: uppercase; letter-spacing: 0.05em;">
          © 2026 Kloche Interiors • Karuna Rd, Nairobi, Kenya
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Lead notification email sent successful:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Failed to send SMTP lead notification email:", err);
    return { success: false, error: err };
  }
}
