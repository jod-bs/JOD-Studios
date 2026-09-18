import { NextResponse } from "next/server";
import { getSubmissions, createSubmission } from "@/lib/db";

const NAME_REGEX = /^[a-zA-Z\s.'-]{2,60}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const HAS_LETTERS_REGEX = /[a-zA-Z]/;
const HAS_DIGITS_REGEX = /[0-9]/;
const ALLOWED_SERVICES = ["Dubbing", "SFX & Music", "Audio Mix", "Video Edit", "VFX", "Animation"];
const ALLOWED_TIMELINES = ["Urgent", "1-2 weeks", "1 month", "Flexible"];

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
    const { service, description, timeline, budget, name, email, phone } = body;

    // 1. Mandatory presence check
    if (!service || !service.trim()) {
      return NextResponse.json({ success: false, error: "Service selection is required" }, { status: 400 });
    }
    if (!ALLOWED_SERVICES.includes(service.trim())) {
      return NextResponse.json({ success: false, error: "Invalid service selection" }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ success: false, error: "Project description is required" }, { status: 400 });
    }
    if (description.trim().length < 8) {
      return NextResponse.json({ success: false, error: "Project description is too short" }, { status: 400 });
    }
    if (!timeline || !timeline.trim()) {
      return NextResponse.json({ success: false, error: "Project timeline is required" }, { status: 400 });
    }
    if (!ALLOWED_TIMELINES.includes(timeline.trim())) {
      return NextResponse.json({ success: false, error: "Invalid timeline selection" }, { status: 400 });
    }
    if (!budget || !budget.trim()) {
      return NextResponse.json({ success: false, error: "Working budget is required" }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Your name is required" }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: "Your email is required" }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ success: false, error: "Your phone / WhatsApp number is required" }, { status: 400 });
    }

    const trimmedBudget = budget.trim();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    // 2. Budget strict numeric validation (no letters, contains numbers)
    if (HAS_LETTERS_REGEX.test(trimmedBudget) || !HAS_DIGITS_REGEX.test(trimmedBudget)) {
      return NextResponse.json(
        { success: false, error: "Budget must be a numeric value (numbers only, no alphabets)." },
        { status: 400 }
      );
    }

    // 3. Name strict text validation (letters only, no digits)
    if (HAS_DIGITS_REGEX.test(trimmedName) || !NAME_REGEX.test(trimmedName)) {
      return NextResponse.json(
        { success: false, error: "Name must contain letters only (no numbers or invalid symbols)." },
        { status: 400 }
      );
    }

    // 4. Email strict format validation
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address (e.g. name@domain.com)." },
        { status: 400 }
      );
    }

    // 5. Phone number strict numeric validation (numbers only, min 10 digits, no letters)
    if (HAS_LETTERS_REGEX.test(trimmedPhone)) {
      return NextResponse.json(
        { success: false, error: "Phone number cannot contain letters. Numbers only." },
        { status: 400 }
      );
    }
    const digitsOnly = trimmedPhone.replace(/[^0-9]/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return NextResponse.json(
        { success: false, error: "Phone number must be between 10 and 15 digits." },
        { status: 400 }
      );
    }

    const created = await createSubmission({
      service: service.trim(),
      description: description.trim(),
      timeline: timeline.trim(),
      budget: trimmedBudget,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
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
