import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth.schema";

export const mcqQuestion = sqliteTable(
	"mcq_questions",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		question: text("question").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("mcq_questions_userId_idx").on(table.userId)],
);

export const mcqChoice = sqliteTable(
	"mcq_choices",
	{
		id: text("id").primaryKey(),
		mcqId: text("mcq_id")
			.notNull()
			.references(() => mcqQuestion.id, { onDelete: "cascade" }),
		text: text("text").notNull(),
		isCorrect: integer("is_correct", { mode: "boolean" }).notNull().default(false),
		sortOrder: integer("sort_order").notNull(),
	},
	(table) => [index("mcq_choices_mcqId_idx").on(table.mcqId)],
);

export const mcqAttempt = sqliteTable(
	"mcq_attempts",
	{
		id: text("id").primaryKey(),
		mcqId: text("mcq_id")
			.notNull()
			.references(() => mcqQuestion.id, { onDelete: "cascade" }),
		choiceId: text("choice_id")
			.notNull()
			.references(() => mcqChoice.id, { onDelete: "cascade" }),
		isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index("mcq_attempts_mcqId_idx").on(table.mcqId),
		index("mcq_attempts_userId_idx").on(table.userId),
	],
);

export const mcqQuestionRelations = relations(mcqQuestion, ({ one, many }) => ({
	user: one(user, {
		fields: [mcqQuestion.userId],
		references: [user.id],
	}),
	choices: many(mcqChoice),
	attempts: many(mcqAttempt),
}));

export const mcqChoiceRelations = relations(mcqChoice, ({ one }) => ({
	question: one(mcqQuestion, {
		fields: [mcqChoice.mcqId],
		references: [mcqQuestion.id],
	}),
}));

export const mcqAttemptRelations = relations(mcqAttempt, ({ one }) => ({
	question: one(mcqQuestion, {
		fields: [mcqAttempt.mcqId],
		references: [mcqQuestion.id],
	}),
	choice: one(mcqChoice, {
		fields: [mcqAttempt.choiceId],
		references: [mcqChoice.id],
	}),
	user: one(user, {
		fields: [mcqAttempt.userId],
		references: [user.id],
	}),
}));
