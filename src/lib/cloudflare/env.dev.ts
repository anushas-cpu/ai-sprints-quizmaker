/**
 * Development-only fallback when `getCloudflareContext()` lacks bindings in `next dev`.
 * Kept in a separate module so production Worker bundles do not include Wrangler.
 *
 * `getPlatformProxy()` is expensive (~seconds). Cache the result for the dev server
 * process so each request does not spin up Miniflare again.
 */
let devEnvPromise: Promise<CloudflareEnv> | undefined;

export async function getEnvFromWrangler(): Promise<CloudflareEnv> {
	if (!devEnvPromise) {
		devEnvPromise = (async () => {
			const { getPlatformProxy } = await import(/* webpackIgnore: true */ "wrangler");
			const { env } = await getPlatformProxy({
				configPath: "./wrangler.jsonc",
			});

			return env as unknown as CloudflareEnv;
		})();
	}

	return devEnvPromise;
}
