/** Shared studio contact / env config (client-safe values use NEXT_PUBLIC_). */

/** Digits-only E.164 style number for wa.me (no + or spaces). Override via env. */
export const WHATSAPP_NUMBER =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "")) ||
  "919876543210";

export function whatsappUrl(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
