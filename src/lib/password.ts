import { randomBytes } from "crypto";

/** Generates a readable random password like "kx7m-tq2p-9wsb". */
export function generatePassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(12);
  let out = "";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) out += "-";
    out += chars[bytes[i] % chars.length];
  }
  return out;
}
