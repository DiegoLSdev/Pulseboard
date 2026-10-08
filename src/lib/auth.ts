export const SESSION_COOKIE = "pulseboard_session";


export function getPassword(): string | undefined {
  return process.env.DASHBOARD_PASSWORD?.trim() || undefined;
}

/** 
 * A SHA-256 hash derived from the password
 * The cookie never contains the password itself
 * Changing the password makes every existing cookie invalid.
 * */

export async function sessionToken(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`pulseboard:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}