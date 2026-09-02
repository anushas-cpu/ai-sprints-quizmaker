import { redirect } from "next/navigation";

import { AUTH_ROUTES, buildSignInUrl } from "@/lib/auth/routes";
import {
	getSessionTokenFromCookie,
	getSessionWithUser,
	type AppSession,
} from "@/lib/auth/session-store";

export type CurrentSession = AppSession;

export async function getCurrentSession(): Promise<AppSession | null> {
	const token = await getSessionTokenFromCookie();
	if (!token) {
		return null;
	}

	return getSessionWithUser(token);
}

export async function requireAuth(callbackPath: string = AUTH_ROUTES.dashboard): Promise<CurrentSession> {
	const session = await getCurrentSession();

	if (!session) {
		redirect(buildSignInUrl({ callbackUrl: callbackPath }));
	}

	return session;
}

export async function redirectIfAuthenticated(): Promise<void> {
	const session = await getCurrentSession();

	if (session) {
		redirect(AUTH_ROUTES.dashboard);
	}
}
