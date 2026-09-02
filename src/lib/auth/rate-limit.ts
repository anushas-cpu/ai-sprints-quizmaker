import { headers } from "next/headers";

import { getCloudflareEnv } from "@/lib/cloudflare/env";

const AUTH_ACTION_WINDOW_SECONDS = 60;
const AUTH_ACTION_MAX_ATTEMPTS = 10;

export type AuthRateLimitAction = "sign-in" | "sign-up";

export class AuthRateLimitError extends Error {
	constructor() {
		super("Too many authentication attempts.");
		this.name = "AuthRateLimitError";
	}
}

function getClientIp(headerStore: Headers): string {
	return (
		headerStore.get("cf-connecting-ip") ??
		headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		headerStore.get("x-real-ip") ??
		"unknown"
	);
}

export async function enforceAuthActionRateLimit(action: AuthRateLimitAction): Promise<void> {
	const headerStore = await headers();
	const bucketKey = `${action}:${getClientIp(headerStore)}`;
	const env = await getCloudflareEnv();
	const now = Date.now();
	const windowMs = AUTH_ACTION_WINDOW_SECONDS * 1000;

	const existing = await env.DB.prepare(
		"SELECT bucket_key, attempt_count, window_start FROM auth_action_rate_limits WHERE bucket_key = ?1",
	)
		.bind(bucketKey)
		.all<{ bucket_key: string; attempt_count: number; window_start: number }>();

	const row = existing.results?.[0];

	if (!row) {
		await env.DB.prepare(
			"INSERT INTO auth_action_rate_limits (bucket_key, attempt_count, window_start) VALUES (?1, 1, ?2)",
		)
			.bind(bucketKey, now)
			.run();
		return;
	}

	if (now - row.window_start >= windowMs) {
		await env.DB.prepare(
			"UPDATE auth_action_rate_limits SET attempt_count = 1, window_start = ?1 WHERE bucket_key = ?2",
		)
			.bind(now, bucketKey)
			.run();
		return;
	}

	if (row.attempt_count >= AUTH_ACTION_MAX_ATTEMPTS) {
		throw new AuthRateLimitError();
	}

	await env.DB.prepare(
		"UPDATE auth_action_rate_limits SET attempt_count = attempt_count + 1 WHERE bucket_key = ?1",
	)
		.bind(bucketKey)
		.run();
}

export const AUTH_RATE_LIMIT_CONFIG = {
	windowSeconds: AUTH_ACTION_WINDOW_SECONDS,
	maxAttempts: AUTH_ACTION_MAX_ATTEMPTS,
} as const;
