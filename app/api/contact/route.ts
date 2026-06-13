import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "messages.jsonl");

const recent = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 5;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, detail: "Invalid JSON" }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim().toLowerCase();
  const subject = String(data.subject ?? "").trim();
  const message = String(data.message ?? data.body ?? "").trim();

  const errors: Record<string, string> = {};
  if (!name || name.length > 120) errors.name = "Name is required (max 120 chars)";
  if (!email || !isEmail(email) || email.length > 254) errors.email = "Valid email is required";
  if (!message || message.length > 5000) errors.message = "Message is required (max 5000 chars)";
  if (subject.length > 200) errors.subject = "Subject is too long";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, detail: "Validation failed", errors }, { status: 422 });
  }

  const ip = clientIp(req);
  const now = Date.now();
  const history = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (history.length >= LIMIT) {
    return NextResponse.json(
      { ok: false, detail: "Too many submissions — please try again later." },
      { status: 429 }
    );
  }
  history.push(now);
  recent.set(ip, history);

  const record = {
    id: now,
    name,
    email,
    subject,
    message,
    ip,
    user_agent: req.headers.get("user-agent") || "",
    created_at: new Date(now).toISOString(),
  };

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(FILE, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    console.warn("[contact] disk write skipped:", (err as Error).message);
  }

  // Send email via Gmail SMTP (Nodemailer)
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });
      await transporter.sendMail({
        from: `"Portfolio Contact" <${gmailUser}>`,
        to: gmailUser,
        replyTo: email,
        subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#e5e5e5;border-radius:12px;">
            <h2 style="color:#7cc0ff;margin-top:0;">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#888;width:80px;">From</td><td style="padding:8px 0;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#7cc0ff;">${email}</a></td></tr>
              ${subject ? `<tr><td style="padding:8px 0;color:#888;">Subject</td><td style="padding:8px 0;">${subject}</td></tr>` : ""}
            </table>
            <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
            <p style="white-space:pre-wrap;line-height:1.7;margin:0;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
            <p style="color:#555;font-size:12px;margin:0;">IP: ${ip}</p>
          </div>
        `,
      });
      console.log("[contact] email sent via Gmail");
    } catch (err) {
      console.error("[contact] gmail error:", (err as Error).message);
    }
  } else {
    console.warn("[contact] GMAIL_USER or GMAIL_APP_PASSWORD not set — email not sent");
  }

  console.log(`[contact] new message id=${record.id} from=${email}`);

  return NextResponse.json(
    { ok: true, id: record.id, message: "Thanks — your message has been received." },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "/api/contact", methods: ["POST"] });
}
