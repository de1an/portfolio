import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Receives messages from the contact form (`components/common/contact-form.tsx`)
 * and the floating chat (`components/common/chat-widget.tsx`) and forwards each
 * one to every configured channel:
 *
 * - Telegram — instant push to my phone. Needs `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`.
 * - Email via Resend — backup/archive. Needs `RESEND_API_KEY` + `ADMIN_EMAIL`.
 *
 * The request succeeds if at least one channel delivered the message.
 *
 * Body: `{ name?, email?, contact?, message, source?, website? }`. The form sends
 * `email`; the chat sends `contact`, which may be an email or a phone number.
 * `website` is a honeypot — real visitors never see or fill it.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s()./-]{6,20}$/;
const MAX_MESSAGE_LENGTH = 3000;
const MAX_FIELD_LENGTH = 200;

type Source = 'form' | 'chat';

type Inquiry = {
	name: string;
	contact: string;
	contactType: 'email' | 'phone';
	message: string;
	source: Source;
};

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function sourceLabel(source: Source): string {
	return source === 'chat' ? 'chat na sajtu' : 'kontakt forma';
}

function contactEmailHtml({
	name,
	contact,
	contactType,
	message,
	source,
}: Inquiry): string {
	const safeName = escapeHtml(name);
	const safeContact = escapeHtml(contact);
	const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
	const contactHref =
		contactType === 'email'
			? `mailto:${safeContact}`
			: `tel:${escapeHtml(contact.replace(/[^\d+]/g, ''))}`;
	const footer =
		contactType === 'email'
			? `Odgovori direktno na ovaj mejl da odgovoriš ${safeName}.`
			: `${safeName} je ostavio/la broj telefona — javi se pozivom ili porukom.`;

	return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
            <tr>
              <td style="background:#111113;padding:24px 28px;">
                <p style="margin:0;color:#9ca3af;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Nova poruka sa sajta · ${sourceLabel(source)}</p>
                <p style="margin:4px 0 0;color:#ffffff;font-size:20px;font-weight:600;">${safeName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 4px;color:#71717a;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;">${contactType === 'email' ? 'Email' : 'Telefon'}</p>
                <p style="margin:0 0 20px;"><a href="${contactHref}" style="color:#111113;font-size:15px;text-decoration:none;border-bottom:1px solid #d4d4d8;">${safeContact}</a></p>
                <p style="margin:0 0 4px;color:#71717a;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;">Poruka</p>
                <p style="margin:0;color:#27272a;font-size:15px;line-height:1.6;">${safeMessage}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:#fafafa;border-top:1px solid #e4e4e7;">
                <p style="margin:0;color:#a1a1aa;font-size:12px;">Ova poruka je stigla preko: ${sourceLabel(source)}. ${footer}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function inquiryText({
	name,
	contact,
	contactType,
	message,
	source,
}: Inquiry): string {
	return `Nova poruka sa sajta (${sourceLabel(source)})\n\nIme: ${name}\n${contactType === 'email' ? 'Email' : 'Telefon'}: ${contact}\n\n${message}`;
}

/** Sends to Telegram. Returns `null` if not configured, otherwise whether it worked. */
async function sendTelegram(inquiry: Inquiry): Promise<boolean | null> {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;
	if (!token || !chatId) return null;

	try {
		const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			// Plain text (no parse_mode) so visitor input never needs escaping.
			body: JSON.stringify({
				chat_id: chatId,
				text: `💬 ${inquiryText(inquiry)}`,
				disable_web_page_preview: true,
			}),
			signal: AbortSignal.timeout(8000),
		});
		if (!res.ok) {
			console.error('Contact: Telegram failed:', res.status, await res.text());
			return false;
		}
		return true;
	} catch (err) {
		console.error('Contact: Telegram request error:', err);
		return false;
	}
}

/** Sends the email via Resend. Returns `null` if not configured, otherwise whether it worked. */
async function sendEmail(inquiry: Inquiry): Promise<boolean | null> {
	const adminEmail = process.env.ADMIN_EMAIL;
	if (!process.env.RESEND_API_KEY || !adminEmail) return null;

	try {
		const resend = new Resend(process.env.RESEND_API_KEY);
		const { error } = await resend.emails.send({
			from:
				process.env.CONTACT_FROM_EMAIL ||
				'Portfolio sajt <onboarding@resend.dev>',
			to: adminEmail,
			...(inquiry.contactType === 'email' ? { replyTo: inquiry.contact } : {}),
			subject: `Nova poruka sa sajta — ${inquiry.name}`,
			html: contactEmailHtml(inquiry),
			text: inquiryText(inquiry),
		});
		if (error) {
			console.error('Contact: Resend failed to send:', error);
			return false;
		}
		return true;
	} catch (err) {
		console.error('Contact: Resend request error:', err);
		return false;
	}
}

function field(body: Record<string, unknown> | null, key: string): string {
	const value = body?.[key];
	return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
	const body = (await request.json().catch(() => null)) as Record<
		string,
		unknown
	> | null;

	// Honeypot filled → a bot. Pretend it worked so it doesn't retry.
	if (field(body, 'website')) return NextResponse.json({ ok: true });

	const source: Source = field(body, 'source') === 'chat' ? 'chat' : 'form';
	const name = field(body, 'name').slice(0, MAX_FIELD_LENGTH) || 'Posetilac';
	const contact = (field(body, 'contact') || field(body, 'email')).slice(
		0,
		MAX_FIELD_LENGTH,
	);
	const message = field(body, 'message');

	if (!contact || !message) {
		return NextResponse.json(
			{ error: 'Contact and message are required.' },
			{ status: 400 },
		);
	}

	if (message.length > MAX_MESSAGE_LENGTH) {
		return NextResponse.json(
			{ error: 'Message is too long.' },
			{ status: 400 },
		);
	}

	const isEmail = EMAIL_PATTERN.test(contact);
	const isPhone =
		!isEmail &&
		PHONE_PATTERN.test(contact) &&
		contact.replace(/\D/g, '').length >= 6;
	// The contact form only collects an email address.
	if (!isEmail && (source === 'form' || !isPhone)) {
		return NextResponse.json(
			{ error: 'Please provide a valid email address or phone number.' },
			{ status: 400 },
		);
	}

	const inquiry: Inquiry = {
		name,
		contact,
		contactType: isEmail ? 'email' : 'phone',
		message,
		source,
	};

	const results = await Promise.all([
		sendTelegram(inquiry),
		sendEmail(inquiry),
	]);

	if (results.every((r) => r === null)) {
		console.error(
			'Contact: no channel configured (set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID and/or RESEND_API_KEY + ADMIN_EMAIL).',
		);
		return NextResponse.json(
			{ error: 'Messaging is not configured.' },
			{ status: 500 },
		);
	}

	if (!results.some((r) => r === true)) {
		return NextResponse.json(
			{ error: 'Message could not be sent.' },
			{ status: 502 },
		);
	}

	return NextResponse.json({ ok: true });
}
