export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  input: string,
  storedHash: string
): Promise<boolean> {
  if (!storedHash) return true;
  const inputHash = await hashPassword(input);
  return inputHash === storedHash;
}
