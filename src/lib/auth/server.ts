/**
 * Auth runtime lives in `session-store.ts`, `session.ts`, and `actions.ts`.
 * This file remains as a stable import path for session configuration.
 */
export {
	SESSION_COOKIE_NAME,
	SESSION_MAX_AGE_SECONDS,
	type AppSession,
	type SessionUser,
} from "./session-store";

export type { CurrentSession } from "./session";
