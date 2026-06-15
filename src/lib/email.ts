import { CREATOR_NAME } from "@/lib/constants";

const ZEPTOMAIL_API_URL = "https://api.zeptomail.com/v1.1/email";

interface ZeptoMailRecipient {
  address: string;
  name?: string;
}

interface ZeptoMailSendOptions {
  to: ZeptoMailRecipient;
  subject: string;
  htmlbody: string;
}

function getZeptoMailConfig() {
  return {
    token: process.env.ZEPTOMAIL_SEND_TOKEN,
    fromEmail: process.env.ZEPTOMAIL_FROM_EMAIL,
  };
}

async function sendZeptoMail({ to, subject, htmlbody }: ZeptoMailSendOptions) {
  const { token, fromEmail } = getZeptoMailConfig();

  if (!token || !fromEmail) {
    return { success: false, skipped: true as const };
  }

  const response = await fetch(ZEPTOMAIL_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Zoho-enczapikey ${token}`,
    },
    body: JSON.stringify({
      from: { address: fromEmail, name: "TestifyAI" },
      to: [
        {
          email_address: {
            address: to.address,
            name: to.name ?? to.address,
          },
        },
      ],
      subject,
      htmlbody,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to send email via ZeptoMail:", response.status, errorBody);
    return { success: false, error: errorBody };
  }

  return { success: true };
}

interface NotificationData {
  fullName: string;
  relationshipType: string;
  finalTestimonial: string;
}

export async function sendTestimonialNotification(data: NotificationData) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || !process.env.ZEPTOMAIL_SEND_TOKEN) {
    console.warn(
      "Email notification skipped: missing ADMIN_EMAIL or ZEPTOMAIL_SEND_TOKEN"
    );
    return { success: false, skipped: true };
  }

  return sendZeptoMail({
    to: { address: adminEmail, name: "Admin" },
    subject: "New Testimonial Submitted",
    htmlbody: `
      <h2>New Testimonial Submitted</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Relationship:</strong> ${data.relationshipType}</p>
      <p><strong>Testimonial:</strong></p>
      <blockquote style="border-left: 3px solid #6366f1; padding-left: 16px; margin: 16px 0; font-style: italic;">
        ${data.finalTestimonial}
      </blockquote>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin">View in Dashboard</a></p>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!process.env.ZEPTOMAIL_SEND_TOKEN) return;

  await sendZeptoMail({
    to: { address: email, name },
    subject: `Thank you for sharing your experience with ${CREATOR_NAME}`,
    htmlbody: `
      <h2>Thank you, ${name}!</h2>
      <p>Your testimonial has been submitted successfully. ${CREATOR_NAME} truly appreciates you taking the time to share your experience.</p>
      <p>Your words make a real difference.</p>
    `,
  });
}
