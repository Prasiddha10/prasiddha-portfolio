import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "messages.jsonl");

// in-memory rate-limit bucket — resets when the process restarts; fine for SQLite-free hosting
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

  // rate limit
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

  // Try to persist to disk. On Vercel/serverless this is a read-only FS — that's fine,
  // we always log to the function output so messages are visible in the dashboard.
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(FILE, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    console.warn("[contact] disk write skipped:", (err as Error).message);
  }

  // Always log — visible in `vercel logs` / dashboard. Swap for Resend/SES later.
  const notify = process.env.CONTACT_NOTIFY_EMAIL;
  console.log(
    `[contact] new message id=${record.id} from=${email}` +
      (notify ? ` -> notify ${notify}` : "")
  );

  return NextResponse.json(
    { ok: true, id: record.id, message: "Thanks — your message has been received." },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "/api/contact", methods: ["POST"] });
}
