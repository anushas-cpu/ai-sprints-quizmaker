export const AUTH_ROUTES = {
	signIn: "/sign-in",
	signUp: "/sign-up",
	dashboard: "/dashboard",
} as const;

export const PROTECTED_ROUTE_PREFIXES = [AUTH_ROUTES.dashboard] as const;

export const GUEST_ONLY_ROUTES = [AUTH_ROUTES.signIn, AUTH_ROUTES.signUp] as const;

export function isProtectedRoute(pathname: string): boolean {
	return PROTECTED_ROUTE_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);
}

export function isGuestOnlyRoute(pathname: string): boolean {
	return (GUEST_ONLY_ROUTES as readonly string[]).includes(pathname);
}

type SignInUrlOptions = {
	callbackUrl?: string;
	expired?: boolean;
	registered?: boolean;
	signedOut?: boolean;
};

export function buildSignInUrl(options: SignInUrlOptions = {}): string {
	const params = new URLSearchParams();

	if (options.callbackUrl) {
		params.set("callbackUrl", options.callbackUrl);
	}

	if (options.expired) {
		params.set("expired", "1");
	}

	if (options.registered) {
		params.set("registered", "1");
	}

	if (options.signedOut) {
		params.set("signedOut", "1");
	}

	const query = params.toString();
	return query ? `${AUTH_ROUTES.signIn}?${query}` : AUTH_ROUTES.signIn;
}

export function getSafeCallbackUrl(value: FormDataEntryValue | null | undefined): string {
	if (typeof value !== "string") {
		return AUTH_ROUTES.dashboard;
	}

	const trimmed = value.trim();
	if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
		return AUTH_ROUTES.dashboard;
	}

	return trimmed;
}
