import type { Metadata } from "next";
import "./globals.css";
import "./home.css";

export const metadata: Metadata = {
  title: "JOD Studios | Post-Production",
  description: "JOD Studios is an independent post-production studio in India for dubbing, music, sound, picture, VFX and animation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
