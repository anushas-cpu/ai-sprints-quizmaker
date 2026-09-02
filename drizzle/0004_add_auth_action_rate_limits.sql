-- Migration number: 0004 	 2026-08-24T13:16:00.000Z

CREATE TABLE `auth_action_rate_limits` (
	`bucket_key` text PRIMARY KEY NOT NULL,
	`attempt_count` integer NOT NULL DEFAULT 1,
	`window_start` integer NOT NULL
);
