const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function textToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function createSignature(value) {
  const secret = process.env.HELIX_ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );

  return textToHex(signature);
}

export async function createAdminSession() {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const signature = await createSignature(issuedAt);

  return `${issuedAt}.${signature}`;
}

export async function isValidAdminSession(sessionValue) {
  if (!sessionValue || typeof sessionValue !== "string") {
    return false;
  }

  const [issuedAt, signature] = sessionValue.split(".");

  if (!issuedAt || !signature || !/^d+$/.test(issuedAt)) {
    return false;
  }

  const issuedAtNumber = Number(issuedAt);
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime - issuedAtNumber > SESSION_DURATION_SECONDS) {
    return false;
  }

  if (issuedAtNumber > currentTime + 60) {
    return false;
  }

  const expectedSignature = await createSignature(issuedAt);

  return signature === expectedSignature;
}
