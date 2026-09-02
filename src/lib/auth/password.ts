const ITERATIONS = 210_000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;

function toBase64(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array {
	return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);

	const saltBytes = new Uint8Array(salt);

	return crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: saltBytes,
			iterations: ITERATIONS,
			hash: "SHA-256",
		},
		keyMaterial,
		KEY_LENGTH * 8,
	);
}

/** Hash a password for storage. Uses PBKDF2-SHA256 via the Web Crypto API (Workers-compatible). */
export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
	const derivedKey = new Uint8Array(await deriveKey(password, salt));

	return `${toBase64(salt)}:${toBase64(derivedKey)}`;
}

/** Verify a plaintext password against a stored hash. */
export async function verifyPassword(storedHash: string, password: string): Promise<boolean> {
	const [saltBase64, hashBase64] = storedHash.split(":");
	if (!saltBase64 || !hashBase64) {
		return false;
	}

	const salt = fromBase64(saltBase64);
	const expectedHash = fromBase64(hashBase64);
	const actualHash = new Uint8Array(await deriveKey(password, salt));

	if (expectedHash.length !== actualHash.length) {
		return false;
	}

	let mismatch = 0;
	for (let index = 0; index < expectedHash.length; index += 1) {
		mismatch |= expectedHash[index]! ^ actualHash[index]!;
	}

	return mismatch === 0;
}
