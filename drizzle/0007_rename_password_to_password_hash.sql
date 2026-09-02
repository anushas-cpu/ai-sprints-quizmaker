-- Migration number: 0007 	 2026-09-02T12:00:00.000Z
-- Rename users.password to password_hash (passwordHash in application code)

ALTER TABLE `users` RENAME COLUMN `password` TO `password_hash`;
