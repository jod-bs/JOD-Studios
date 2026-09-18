import { NextResponse } from "next/server";
import { updateSubmission, deleteSubmission, ProjectSubmission } from "@/lib/db";

const VALID_STATUSES: ProjectSubmission["status"][] = ["new", "in_review", "contacted", "archived"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id?.trim()) {
      return NextResponse.json({ success: false, error: "Submission id is required" }, { status: 400 });
    }

    const body = await request.json();
    const { status, notes } = body;

    const updates: Partial<Pick<ProjectSubmission, "status" | "notes">> = {};

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { success: false, error: "Invalid status. Use new, in_review, contacted, or archived." },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (notes !== undefined) {
      if (typeof notes !== "string") {
        return NextResponse.json({ success: false, error: "Notes must be a string" }, { status: 400 });
      }
      updates.notes = notes;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "Provide status and/or notes to update" },
        { status: 400 }
      );
    }

    const updated = await updateSubmission(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id?.trim()) {
      return NextResponse.json({ success: false, error: "Submission id is required" }, { status: 400 });
    }

    const deleted = await deleteSubmission(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Submission deleted" });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
