-- Migration number: 0008 	 2026-09-02T00:00:00.000Z

CREATE TABLE `mcq_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `mcq_questions_userId_idx` ON `mcq_questions` (`user_id`);--> statement-breakpoint
CREATE TABLE `mcq_choices` (
	`id` text PRIMARY KEY NOT NULL,
	`mcq_id` text NOT NULL,
	`text` text NOT NULL,
	`is_correct` integer DEFAULT false NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`mcq_id`) REFERENCES `mcq_questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `mcq_choices_mcqId_idx` ON `mcq_choices` (`mcq_id`);--> statement-breakpoint
CREATE TABLE `mcq_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`mcq_id` text NOT NULL,
	`choice_id` text NOT NULL,
	`is_correct` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`mcq_id`) REFERENCES `mcq_questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`choice_id`) REFERENCES `mcq_choices`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `mcq_attempts_mcqId_idx` ON `mcq_attempts` (`mcq_id`);--> statement-breakpoint
CREATE INDEX `mcq_attempts_userId_idx` ON `mcq_attempts` (`user_id`);
