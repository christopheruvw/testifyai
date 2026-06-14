import { Resend } from "resend";
import { CREATOR_NAME } from "@/lib/constants";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface NotificationData {
  fullName: string;
  relationshipType: string;
  finalTestimonial: string;
}

export async function sendTestimonialNotification(data: NotificationData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!adminEmail || !process.env.RESEND_API_KEY) {
    console.warn("Email notification skipped: missing ADMIN_EMAIL or RESEND_API_KEY");
    return { success: false, skipped: true };
  }

  const { error } = await getResend().emails.send({
    from: `TestifyAI <${fromEmail}>`,
    to: adminEmail,
    subject: "New Testimonial Submitted",
    html: `
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

  if (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }

  return { success: true };
}

export async function sendWelcomeEmail(email: string, name: string) {
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!process.env.RESEND_API_KEY) return;

  await getResend().emails.send({
    from: `TestifyAI <${fromEmail}>`,
    to: email,
    subject: `Thank you for sharing your experience with ${CREATOR_NAME}`,
    html: `
      <h2>Thank you, ${name}!</h2>
      <p>Your testimonial has been submitted successfully. ${CREATOR_NAME} truly appreciates you taking the time to share your experience.</p>
      <p>Your words make a real difference.</p>
    `,
  });
}
