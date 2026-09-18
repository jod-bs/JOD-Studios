import fs from "fs/promises";
import path from "path";

export interface ProjectSubmission {
  id: string;
  service: string;
  description: string;
  timeline: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  status: "new" | "in_review" | "contacted" | "archived";
  createdAt: string;
  notes?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "submissions.json");

/** Serialize file writes so concurrent API requests do not clobber each other. */
let writeQueue: Promise<void> = Promise.resolve();

function enqueueWrite<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(DB_FILE);
  } catch {
    const initialData: ProjectSubmission[] = [
      {
        id: "proj_demo_01",
        service: "SFX & Music",
        description:
          "Need cinematic sound design, foley and atmospheric score for a 15-minute sci-fi short film.",
        timeline: "1-2 weeks",
        budget: "₹1,50,000 - ₹2,50,000",
        name: "Aarav Sharma",
        email: "aarav@cineverse.studio",
        phone: "+91 98765 43210",
        status: "new",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        notes: "Client mentioned they have raw cuts ready for sync.",
      },
      {
        id: "proj_demo_02",
        service: "VFX",
        description:
          "Commercial brand film requiring 3D logo disintegration and cybernetic glow pass on 12 shots.",
        timeline: "Urgent",
        budget: "₹3,00,000+",
        name: "Priya Nair",
        email: "priya@lumina-agency.com",
        phone: "+91 98111 22334",
        status: "contacted",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        notes: "Followed up via WhatsApp. Awaiting storyboard.",
      },
    ];
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
  }
}

async function readSubmissions(): Promise<ProjectSubmission[]> {
  await ensureDataFile();
  try {
    const data = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading submissions database:", error);
    return [];
  }
}

export async function getSubmissions(): Promise<ProjectSubmission[]> {
  return readSubmissions();
}

export async function createSubmission(
  input: Omit<ProjectSubmission, "id" | "createdAt" | "status">
): Promise<ProjectSubmission> {
  return enqueueWrite(async () => {
    const list = await readSubmissions();
    const newSubmission: ProjectSubmission = {
      id: "proj_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6),
      service: input.service,
      description: input.description,
      timeline: input.timeline,
      budget: input.budget,
      name: input.name,
      email: input.email,
      phone: input.phone,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    list.unshift(newSubmission);
    await fs.writeFile(DB_FILE, JSON.stringify(list, null, 2), "utf8");
    return newSubmission;
  });
}

export async function updateSubmission(
  id: string,
  updates: Partial<Pick<ProjectSubmission, "status" | "notes">>
): Promise<ProjectSubmission | null> {
  return enqueueWrite(async () => {
    const list = await readSubmissions();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    await fs.writeFile(DB_FILE, JSON.stringify(list, null, 2), "utf8");
    return list[index];
  });
}

export async function deleteSubmission(id: string): Promise<boolean> {
  return enqueueWrite(async () => {
    const list = await readSubmissions();
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length === list.length) return false;

    await fs.writeFile(DB_FILE, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  });
}
