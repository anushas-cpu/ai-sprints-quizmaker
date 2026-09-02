/**
 * Legacy Better Auth CLI config for `npm run auth:generate`.
 * Runtime authentication uses custom D1 session handling in `session-store.ts` and `actions.ts`.
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	database: drizzleAdapter({} as never, {
		provider: "sqlite",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
	},
	rateLimit: {
		enabled: true,
	},
});
