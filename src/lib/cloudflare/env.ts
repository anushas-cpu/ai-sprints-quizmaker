import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Returns the Cloudflare Worker env, including D1 and other bindings.
 *
 * In `next dev`, always resolve bindings through Wrangler's platform proxy.
 * The OpenNext dev context can retain D1 stubs that become invalid after
 * Miniflare restarts (hot reload), which triggers "poisoned stub" errors.
 */
export async function getCloudflareEnv(): Promise<CloudflareEnv> {
	if (process.env.NODE_ENV === "development") {
		const { getEnvFromWrangler } = await import("./env.dev");
		return getEnvFromWrangler();
	}

	const { env } = await getCloudflareContext({ async: true });

	if (env.DB && env.BETTER_AUTH_SECRET) {
		return env;
	}

	throw new Error(
		"Missing required Cloudflare bindings (DB and BETTER_AUTH_SECRET).",
	);
}
