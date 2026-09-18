import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOD Studios | Post-Production",
  description: "JOD Studios — dubbing, sound, music, picture, VFX and animation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
