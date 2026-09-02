-- Migration number: 0009 	 2026-09-02T00:00:00.000Z

ALTER TABLE `mcq_questions` RENAME COLUMN `description` TO `question`;
--> statement-breakpoint
UPDATE `mcq_questions` SET `question` = '' WHERE `question` IS NULL;
--> statement-breakpoint
-- SQLite cannot alter column nullability in place; recreate table for NOT NULL question.
CREATE TABLE `mcq_questions_new` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`question` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `mcq_questions_new` (`id`, `name`, `question`, `user_id`, `created_at`, `updated_at`)
SELECT `id`, `name`, `question`, `user_id`, `created_at`, `updated_at`
FROM `mcq_questions`;
--> statement-breakpoint
DROP TABLE `mcq_questions`;
--> statement-breakpoint
ALTER TABLE `mcq_questions_new` RENAME TO `mcq_questions`;
--> statement-breakpoint
CREATE INDEX `mcq_questions_userId_idx` ON `mcq_questions` (`user_id`);
