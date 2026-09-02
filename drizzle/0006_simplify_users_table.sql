-- Migration number: 0006 	 2026-09-02T00:00:00.000Z
-- Simplify users to required columns only: id, name, email, password

CREATE TABLE `users_new` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `users_new` (`id`, `name`, `email`, `password`)
SELECT
	u.`id`,
	u.`name`,
	u.`email`,
	COALESCE(a.`password`, '')
FROM `users` u
LEFT JOIN `accounts` a ON a.`user_id` = u.`id` AND a.`provider_id` = 'credential';
--> statement-breakpoint
DROP TABLE `users`;
--> statement-breakpoint
ALTER TABLE `users_new` RENAME TO `users`;
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
