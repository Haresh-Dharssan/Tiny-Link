import { nanoid } from "nanoid";

// Generates a 6-character URL-safe short code
export function generateCode(length = 6) {
  return nanoid(length);
}
