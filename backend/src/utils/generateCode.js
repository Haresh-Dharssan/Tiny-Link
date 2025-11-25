import { customAlphabet } from "nanoid";

// Allowed characters: A-Z, a-z, 0-9
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Generates a 6-character URL-safe short code
export const generateCode = (length = 6) => {
  const nano = customAlphabet(alphabet, length);
  return nano();
};