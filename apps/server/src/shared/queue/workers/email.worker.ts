import { Resend } from "resend";
import { env } from "../../../config/env";
import { emailQueue } from "../queue";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

emailQueue.process(async (job) => {
  const { to, subject, html, from = "noreply@place-me.app" } = job.data;

  if (!resend) {
    console.log("[Email Worker] Mock email sent:", { to, subject });
    return { success: true, mock: true };
  }

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    console.log("[Email Worker] Email sent:", result);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("[Email Worker] Failed:", error);
    throw error;
  }
});

console.log("[Email Worker] Started");
