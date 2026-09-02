import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import { schema } from "@/lib/db/schema";

export type TestDb = BetterSQLite3Database<typeof schema>;

export function createTestDb(): TestDb {
	const sqlite = new Database(":memory:");
	const db = drizzle(sqlite, { schema });

	sqlite.exec(`
		CREATE TABLE users (
			id text PRIMARY KEY NOT NULL,
			name text NOT NULL,
			email text NOT NULL UNIQUE,
			password_hash text NOT NULL
		);

		CREATE TABLE mcq_questions (
			id text PRIMARY KEY NOT NULL,
			name text NOT NULL,
			question text NOT NULL,
			user_id text NOT NULL,
			created_at integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
			updated_at integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade
		);

		CREATE INDEX mcq_questions_userId_idx ON mcq_questions (user_id);

		CREATE TABLE mcq_choices (
			id text PRIMARY KEY NOT NULL,
			mcq_id text NOT NULL,
			text text NOT NULL,
			is_correct integer NOT NULL DEFAULT 0,
			sort_order integer NOT NULL,
			FOREIGN KEY (mcq_id) REFERENCES mcq_questions(id) ON DELETE cascade
		);

		CREATE INDEX mcq_choices_mcqId_idx ON mcq_choices (mcq_id);

		CREATE TABLE mcq_attempts (
			id text PRIMARY KEY NOT NULL,
			mcq_id text NOT NULL,
			choice_id text NOT NULL,
			is_correct integer NOT NULL,
			user_id text NOT NULL,
			created_at integer NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
			FOREIGN KEY (mcq_id) REFERENCES mcq_questions(id) ON DELETE cascade,
			FOREIGN KEY (choice_id) REFERENCES mcq_choices(id) ON DELETE cascade,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade
		);

		CREATE INDEX mcq_attempts_mcqId_idx ON mcq_attempts (mcq_id);
		CREATE INDEX mcq_attempts_userId_idx ON mcq_attempts (user_id);
	`);

	return db;
}

export async function seedTestUser(db: TestDb, overrides?: Partial<{ id: string; name: string; email: string }>) {
	const id = overrides?.id ?? "user-1";
	const name = overrides?.name ?? "Test User";
	const email = overrides?.email ?? "test@example.com";

	await db.insert(schema.user).values({
		id,
		name,
		email,
		passwordHash: "hash",
	});

	return { id, name, email };
}
