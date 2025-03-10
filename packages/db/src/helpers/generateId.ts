// Simple and compatible ID generator
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function generateRandomString(length: number): string {
  let result = '';
  const len = ALPHABET.length;
  const arr = new Uint8Array(length);
  
  // In modern environments (including Cloudflare Workers and Next.js),
  // crypto is always available on globalThis
  globalThis.crypto.getRandomValues(arr);
  
  for (let i = 0; i < length; i++) {
    result += ALPHABET.charAt(arr[i]! % len);
  }
  return result;
}

const prefixes = {
  generic: "id",
  place: "bt",
  map: "map",
  marker: "mar",
  collection: "col",
  user: "user",
  test: "test", // <-- for tests only
} as const;

export function generateId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], generateRandomString(16)].join("_");
}
