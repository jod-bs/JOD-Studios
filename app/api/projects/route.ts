import { NextResponse } from "next/server";
import { getSubmissions, createSubmission } from "@/lib/db";

const NAME_REGEX = /^[\p{L}\s.'-]{2,60}$/u;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const HAS_LETTERS_REGEX = /\p{L}/u;
const HAS_DIGITS_REGEX = /[0-9]/;
const ALLOWED_SERVICES = ["Dubbing", "SFX & Music", "Audio Mix", "Video Edit", "VFX", "Animation"];
const ALLOWED_TIMELINES = ["Urgent", "1-2 weeks", "1 month", "Flexible"];

function asTrimmedString(value: unknown): string | null {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value).trim();
  return null;
}

export async function GET() {
  try {
    const submissions = await getSubmissions();
    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const service = asTrimmedString(body.service);
    const description = asTrimmedString(body.description);
    const timeline = asTrimmedString(body.timeline);
    const budget = asTrimmedString(body.budget);
    const name = asTrimmedString(body.name);
    const email = asTrimmedString(body.email);
    const phone = asTrimmedString(body.phone);

    if (!service) {
      return NextResponse.json({ success: false, error: "Service selection is required" }, { status: 400 });
    }
    if (!ALLOWED_SERVICES.includes(service)) {
      return NextResponse.json({ success: false, error: "Invalid service selection" }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ success: false, error: "Project description is required" }, { status: 400 });
    }
    if (description.length < 8) {
      return NextResponse.json({ success: false, error: "Project description is too short" }, { status: 400 });
    }
    if (!timeline) {
      return NextResponse.json({ success: false, error: "Project timeline is required" }, { status: 400 });
    }
    if (!ALLOWED_TIMELINES.includes(timeline)) {
      return NextResponse.json({ success: false, error: "Invalid timeline selection" }, { status: 400 });
    }
    if (!budget) {
      return NextResponse.json({ success: false, error: "Working budget is required" }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ success: false, error: "Your name is required" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ success: false, error: "Your email is required" }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ success: false, error: "Your phone / WhatsApp number is required" }, { status: 400 });
    }

    if (HAS_LETTERS_REGEX.test(budget) || !HAS_DIGITS_REGEX.test(budget)) {
      return NextResponse.json(
        { success: false, error: "Budget must be a numeric value (numbers only, no alphabets)." },
        { status: 400 }
      );
    }
    const budgetDigits = budget.replace(/[^0-9]/g, "");
    if (budgetDigits.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid numeric budget amount." },
        { status: 400 }
      );
    }

    if (HAS_DIGITS_REGEX.test(name) || !NAME_REGEX.test(name)) {
      return NextResponse.json(
        { success: false, error: "Name must contain letters only (no numbers or invalid symbols)." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address (e.g. name@domain.com)." },
        { status: 400 }
      );
    }

    if (HAS_LETTERS_REGEX.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Phone number cannot contain letters. Numbers only." },
        { status: 400 }
      );
    }
    const digitsOnly = phone.replace(/[^0-9]/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return NextResponse.json(
        { success: false, error: "Phone number must be between 10 and 15 digits." },
        { status: 400 }
      );
    }

    const created = await createSubmission({
      service,
      description,
      timeline,
      budget,
      name,
      email,
      phone,
    });

    return NextResponse.json({ success: true, submission: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save project submission" },
      { status: 500 }
    );
  }
}
