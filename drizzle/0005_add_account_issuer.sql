-- Migration number: 0005 	 2026-08-24T14:52:00.000Z

ALTER TABLE `accounts` ADD COLUMN `issuer` text NOT NULL DEFAULT '';
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_issuer_accountId_unique` ON `accounts` (`issuer`, `account_id`);
