import { sql } from "drizzle-orm";

import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getDb } from "@/lib/db";
import { user } from "@/lib/db/auth.schema";

export type PublicUser = {
	id: string;
	name: string;
	email: string;
};

export async function isEmailRegistered(email: string): Promise<boolean> {
	const db = await getDb();
	const existingUsers = await db
		.select({ id: user.id })
		.from(user)
		.where(sql`lower(${user.email}) = lower(${email})`)
		.limit(1);

	return existingUsers.length > 0;
}

export async function createUser(input: {
	name: string;
	email: string;
	password: string;
}): Promise<PublicUser> {
	const db = await getDb();
	const id = crypto.randomUUID();
	const passwordHash = await hashPassword(input.password);

	await db.insert(user).values({
		id,
		name: input.name,
		email: input.email,
		passwordHash,
	});

	return {
		id,
		name: input.name,
		email: input.email,
	};
}

export async function verifyUserCredentials(
	email: string,
	password: string,
): Promise<PublicUser | null> {
	const db = await getDb();
	const rows = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			passwordHash: user.passwordHash,
		})
		.from(user)
		.where(sql`lower(${user.email}) = lower(${email})`)
		.limit(1);

	const found = rows[0];
	if (!found) {
		return null;
	}

	const valid = await verifyPassword(found.passwordHash, password);
	if (!valid) {
		return null;
	}

	return {
		id: found.id,
		name: found.name,
		email: found.email,
	};
}
