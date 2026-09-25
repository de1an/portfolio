import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function contactEmailHtml({ name, email, message }: { name: string; email: string; message: string }): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
            <tr>
              <td style="background:#111113;padding:24px 28px;">
                <p style="margin:0;color:#9ca3af;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Nova poruka sa sajta</p>
                <p style="margin:4px 0 0;color:#ffffff;font-size:20px;font-weight:600;">${safeName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 4px;color:#71717a;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;">Email</p>
                <p style="margin:0 0 20px;"><a href="mailto:${safeEmail}" style="color:#111113;font-size:15px;text-decoration:none;border-bottom:1px solid #d4d4d8;">${safeEmail}</a></p>
                <p style="margin:0 0 4px;color:#71717a;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;">Poruka</p>
                <p style="margin:0;color:#27272a;font-size:15px;line-height:1.6;">${safeMessage}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:#fafafa;border-top:1px solid #e4e4e7;">
                <p style="margin:0;color:#a1a1aa;font-size:12px;">Ova poruka je stigla sa kontakt forme na tvom sajtu. Odgovori direktno na ovaj mejl da odgovoriš ${safeName}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function contactEmailText({ name, email, message }: { name: string; email: string; message: string }): string {
  return `Nova poruka sa sajta\n\nIme: ${name}\nEmail: ${email}\n\n${message}\n\n— Ova poruka je stigla sa kontakt forme na sajtu. Odgovori direktno na ovaj mejl da odgovoriš ${name}.`;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!process.env.RESEND_API_KEY || !adminEmail) {
    console.error("Contact form: RESEND_API_KEY or ADMIN_EMAIL is not set.");
    return NextResponse.json({ error: "Email is not configured." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Portfolio sajt <onboarding@resend.dev>",
    to: adminEmail,
    replyTo: email,
    subject: `Nova poruka sa sajta — ${name}`,
    html: contactEmailHtml({ name, email, message }),
    text: contactEmailText({ name, email, message }),
  });

  if (error) {
    console.error("Contact form: Resend failed to send:", error);
    return NextResponse.json({ error: "Message could not be sent." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
