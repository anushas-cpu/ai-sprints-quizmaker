"use server";

import { redirect } from "next/navigation";

import { AUTH_MESSAGES } from "@/lib/auth/messages";
import { buildSignInUrl, getSafeCallbackUrl } from "@/lib/auth/routes";
import { AuthRateLimitError, enforceAuthActionRateLimit } from "@/lib/auth/rate-limit";
import {
	clearSessionCookie,
	createSession,
	deleteSessionByToken,
	getSessionTokenFromCookie,
	setSessionCookie,
} from "@/lib/auth/session-store";
import { flattenZodErrors, signInSchema, signUpSchema, type FieldErrors } from "@/lib/auth/validation";
import { createUser, isEmailRegistered, verifyUserCredentials } from "@/lib/services/users";

export type AuthFormState = {
	errors?: FieldErrors;
	formError?: string;
};

export async function signUpAction(
	_prevState: AuthFormState,
	formData: FormData,
): Promise<AuthFormState> {
	const parsed = signUpSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if (!parsed.success) {
		return { errors: flattenZodErrors(parsed.error) };
	}

	try {
		await enforceAuthActionRateLimit("sign-up");
	} catch (error) {
		if (error instanceof AuthRateLimitError) {
			return { formError: AUTH_MESSAGES.common.rateLimited };
		}

		throw error;
	}

	const normalizedEmail = parsed.data.email.toLowerCase();

	if (await isEmailRegistered(normalizedEmail)) {
		return {
			errors: {
				email: [AUTH_MESSAGES.signUp.emailExists],
			},
		};
	}

	try {
		await createUser({
			name: parsed.data.name,
			email: normalizedEmail,
			password: parsed.data.password,
		});
	} catch {
		return { formError: AUTH_MESSAGES.common.serverError };
	}

	redirect("/sign-in?registered=1");
}

export async function logoutAction(): Promise<void> {
	const token = await getSessionTokenFromCookie();

	if (token) {
		await deleteSessionByToken(token);
	}

	await clearSessionCookie();
	redirect(buildSignInUrl({ signedOut: true }));
}

export async function signInAction(
	_prevState: AuthFormState,
	formData: FormData,
): Promise<AuthFormState> {
	const parsed = signInSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return { errors: flattenZodErrors(parsed.error) };
	}

	try {
		await enforceAuthActionRateLimit("sign-in");
	} catch (error) {
		if (error instanceof AuthRateLimitError) {
			return { formError: AUTH_MESSAGES.common.rateLimited };
		}

		throw error;
	}

	const authenticatedUser = await verifyUserCredentials(
		parsed.data.email.toLowerCase(),
		parsed.data.password,
	);

	if (!authenticatedUser) {
		return {
			formError: AUTH_MESSAGES.signIn.invalidCredentials,
		};
	}

	try {
		const token = await createSession(authenticatedUser.id);
		await setSessionCookie(token);
	} catch {
		return { formError: AUTH_MESSAGES.common.serverError };
	}

	const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));
	redirect(callbackUrl);
}
