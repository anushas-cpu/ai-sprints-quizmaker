import { cache } from "react";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { session, user } from "@/lib/db/schema";

export const SESSION_COOKIE_NAME = "quizmaker.session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
	id: string;
	name: string;
	email: string;
};

export type AppSession = {
	user: SessionUser;
};

export const getSessionTokenFromCookie = cache(
	async (): Promise<string | undefined> => {
		const cookieStore = await cookies();
		return cookieStore.get(SESSION_COOKIE_NAME)?.value;
	},
);

export async function setSessionCookie(token: string): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: SESSION_MAX_AGE_SECONDS,
	});
}

export async function clearSessionCookie(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function createSession(userId: string): Promise<string> {
	const db = await getDb();
	const token = crypto.randomUUID();
	const now = new Date();
	const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);

	await db.insert(session).values({
		id: crypto.randomUUID(),
		token,
		userId,
		expiresAt,
		createdAt: now,
		updatedAt: now,
	});

	return token;
}

export async function deleteSessionByToken(token: string): Promise<void> {
	const db = await getDb();
	await db.delete(session).where(eq(session.token, token));
}

export async function getSessionWithUser(token: string): Promise<AppSession | null> {
	const db = await getDb();
	const now = new Date();

	const rows = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
		})
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(and(eq(session.token, token), gt(session.expiresAt, now)))
		.limit(1);

	const found = rows[0];
	if (!found) {
		return null;
	}

	return {
		user: {
			id: found.id,
			name: found.name,
			email: found.email,
		},
	};
}
