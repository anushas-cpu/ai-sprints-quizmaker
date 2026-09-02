import { and, asc, eq, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mcqAttempt, mcqChoice, mcqQuestion } from "@/lib/db/mcq.schema";
import type { McqChoiceInput } from "@/lib/mcq/validation";

export type McqChoice = {
	id: string;
	text: string;
	isCorrect: boolean;
	sortOrder: number;
};

export type McqSummary = {
	id: string;
	name: string;
	question: string;
	createdAt: Date;
	updatedAt: Date;
};

export type McqWithChoices = McqSummary & {
	choices: McqChoice[];
};

export type McqAttempt = {
	id: string;
	mcqId: string;
	choiceId: string;
	isCorrect: boolean;
	userId: string;
	createdAt: Date;
};

type McqWriteInput = {
	name: string;
	question: string;
	choices: McqChoiceInput[];
};

function mapChoice(row: typeof mcqChoice.$inferSelect): McqChoice {
	return {
		id: row.id,
		text: row.text,
		isCorrect: row.isCorrect,
		sortOrder: row.sortOrder,
	};
}

function mapSummary(row: typeof mcqQuestion.$inferSelect): McqSummary {
	return {
		id: row.id,
		name: row.name,
		question: row.question,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}

async function getChoicesForMcqIds(mcqIds: string[]) {
	if (mcqIds.length === 0) {
		return new Map<string, McqChoice[]>();
	}

	const db = await getDb();
	const rows = await db
		.select()
		.from(mcqChoice)
		.where(inArray(mcqChoice.mcqId, mcqIds))
		.orderBy(asc(mcqChoice.sortOrder));

	const grouped = new Map<string, McqChoice[]>();
	for (const row of rows) {
		const existing = grouped.get(row.mcqId) ?? [];
		existing.push(mapChoice(row));
		grouped.set(row.mcqId, existing);
	}

	return grouped;
}

async function insertChoices(mcqId: string, choices: McqChoiceInput[]) {
	const db = await getDb();
	const values = choices.map((choice, index) => ({
		id: crypto.randomUUID(),
		mcqId,
		text: choice.text,
		isCorrect: choice.isCorrect,
		sortOrder: index,
	}));

	await db.insert(mcqChoice).values(values);
}

export async function listMcqsByUser(userId: string): Promise<McqSummary[]> {
	const db = await getDb();
	const rows = await db
		.select()
		.from(mcqQuestion)
		.where(eq(mcqQuestion.userId, userId))
		.orderBy(asc(mcqQuestion.name));

	return rows.map(mapSummary);
}

export async function getMcqByIdForUser(
	mcqId: string,
	userId: string,
): Promise<McqWithChoices | null> {
	const db = await getDb();
	const rows = await db
		.select()
		.from(mcqQuestion)
		.where(and(eq(mcqQuestion.id, mcqId), eq(mcqQuestion.userId, userId)))
		.limit(1);

	const question = rows[0];
	if (!question) {
		return null;
	}

	const choicesByMcq = await getChoicesForMcqIds([question.id]);
	const choices = choicesByMcq.get(question.id) ?? [];

	return {
		...mapSummary(question),
		choices,
	};
}

export async function createMcq(
	userId: string,
	input: McqWriteInput,
): Promise<McqWithChoices> {
	const db = await getDb();
	const id = crypto.randomUUID();

	await db.insert(mcqQuestion).values({
		id,
		name: input.name,
		question: input.question,
		userId,
	});

	await insertChoices(id, input.choices);

	const created = await getMcqByIdForUser(id, userId);
	if (!created) {
		throw new Error("Failed to load created MCQ.");
	}

	return created;
}

export async function updateMcq(
	mcqId: string,
	userId: string,
	input: McqWriteInput,
): Promise<McqWithChoices | null> {
	const db = await getDb();
	const existing = await getMcqByIdForUser(mcqId, userId);
	if (!existing) {
		return null;
	}

	await db
		.update(mcqQuestion)
		.set({
			name: input.name,
			question: input.question,
		})
		.where(and(eq(mcqQuestion.id, mcqId), eq(mcqQuestion.userId, userId)));

	await db.delete(mcqChoice).where(eq(mcqChoice.mcqId, mcqId));
	await insertChoices(mcqId, input.choices);

	return getMcqByIdForUser(mcqId, userId);
}

export async function deleteMcq(mcqId: string, userId: string): Promise<boolean> {
	const db = await getDb();
	const result = await db
		.delete(mcqQuestion)
		.where(and(eq(mcqQuestion.id, mcqId), eq(mcqQuestion.userId, userId)))
		.returning({ id: mcqQuestion.id });

	return result.length > 0;
}

export async function recordMcqAttempt(
	mcqId: string,
	userId: string,
	choiceId: string,
): Promise<McqAttempt | null> {
	const question = await getMcqByIdForUser(mcqId, userId);
	if (!question) {
		return null;
	}

	const selectedChoice = question.choices.find((choice) => choice.id === choiceId);
	if (!selectedChoice) {
		return null;
	}

	const db = await getDb();
	const id = crypto.randomUUID();

	await db.insert(mcqAttempt).values({
		id,
		mcqId,
		choiceId,
		isCorrect: selectedChoice.isCorrect,
		userId,
	});

	const rows = await db
		.select()
		.from(mcqAttempt)
		.where(eq(mcqAttempt.id, id))
		.limit(1);

	const attempt = rows[0];
	if (!attempt) {
		throw new Error("Failed to load recorded attempt.");
	}

	return {
		id: attempt.id,
		mcqId: attempt.mcqId,
		choiceId: attempt.choiceId,
		isCorrect: attempt.isCorrect,
		userId: attempt.userId,
		createdAt: attempt.createdAt,
	};
}
