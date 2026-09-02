/**
 * Development-only fallback when `getCloudflareContext()` lacks bindings in `next dev`.
 * Kept in a separate module so production Worker bundles do not include Wrangler.
 */
export async function getEnvFromWrangler(): Promise<CloudflareEnv> {
	const { getPlatformProxy } = await import(/* webpackIgnore: true */ "wrangler");
	const { env } = await getPlatformProxy({
		configPath: "./wrangler.jsonc",
	});

	return env as unknown as CloudflareEnv;
}
