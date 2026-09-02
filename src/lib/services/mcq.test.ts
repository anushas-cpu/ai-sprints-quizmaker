import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTestDb, seedTestUser } from "@/test/db";

vi.mock("@/lib/db", () => ({
	getDb: vi.fn(),
}));

import { getDb } from "@/lib/db";
import {
	createMcq,
	deleteMcq,
	getMcqByIdForUser,
	listMcqsByUser,
	recordMcqAttempt,
	updateMcq,
} from "@/lib/services/mcq";

const getDbMock = vi.mocked(getDb);

describe("mcq service", () => {
	const userId = "user-1";

	beforeEach(async () => {
		const db = createTestDb();
		getDbMock.mockResolvedValue(db as Awaited<ReturnType<typeof getDb>>);
		await seedTestUser(db, { id: userId });
	});

	it("creates an MCQ with choices", async () => {
		const created = await createMcq(userId, {
			name: "Capital of France",
			question: "What is the capital of France?",
			choices: [
				{ text: "Paris", isCorrect: true },
				{ text: "London", isCorrect: false },
			],
		});

		expect(created.name).toBe("Capital of France");
		expect(created.question).toBe("What is the capital of France?");
		expect(created.choices).toHaveLength(2);
		expect(created.choices.find((choice) => choice.isCorrect)?.text).toBe("Paris");
	});

	it("lists MCQs for a user", async () => {
		await createMcq(userId, {
			name: "Question B",
			question: "Question B text",
			choices: [
				{ text: "A", isCorrect: true },
				{ text: "B", isCorrect: false },
			],
		});
		await createMcq(userId, {
			name: "Question A",
			question: "Question A text",
			choices: [
				{ text: "A", isCorrect: true },
				{ text: "B", isCorrect: false },
			],
		});

		const list = await listMcqsByUser(userId);

		expect(list).toHaveLength(2);
		expect(list.map((item) => item.name)).toEqual(["Question A", "Question B"]);
	});

	it("updates an MCQ and replaces choices", async () => {
		const created = await createMcq(userId, {
			name: "Original",
			question: "Original question",
			choices: [
				{ text: "One", isCorrect: true },
				{ text: "Two", isCorrect: false },
			],
		});

		const updated = await updateMcq(created.id, userId, {
			name: "Updated",
			question: "Updated question text",
			choices: [
				{ text: "Alpha", isCorrect: false },
				{ text: "Beta", isCorrect: true },
				{ text: "Gamma", isCorrect: false },
			],
		});

		expect(updated?.name).toBe("Updated");
		expect(updated?.question).toBe("Updated question text");
		expect(updated?.choices).toHaveLength(3);
		expect(updated?.choices.find((choice) => choice.isCorrect)?.text).toBe("Beta");
	});

	it("deletes an MCQ owned by the user", async () => {
		const created = await createMcq(userId, {
			name: "Delete me",
			question: "Delete me question",
			choices: [
				{ text: "A", isCorrect: true },
				{ text: "B", isCorrect: false },
			],
		});

		const deleted = await deleteMcq(created.id, userId);
		const fetched = await getMcqByIdForUser(created.id, userId);

		expect(deleted).toBe(true);
		expect(fetched).toBeNull();
	});

	it("records an attempt with the correct result", async () => {
		const created = await createMcq(userId, {
			name: "Attempt question",
			question: "Attempt question text",
			choices: [
				{ text: "Right", isCorrect: true },
				{ text: "Wrong", isCorrect: false },
			],
		});

		const correctChoice = created.choices.find((choice) => choice.isCorrect);
		const incorrectChoice = created.choices.find((choice) => !choice.isCorrect);

		expect(correctChoice).toBeDefined();
		expect(incorrectChoice).toBeDefined();

		const correctAttempt = await recordMcqAttempt(
			created.id,
			userId,
			correctChoice!.id,
		);
		const incorrectAttempt = await recordMcqAttempt(
			created.id,
			userId,
			incorrectChoice!.id,
		);

		expect(correctAttempt?.isCorrect).toBe(true);
		expect(incorrectAttempt?.isCorrect).toBe(false);
	});

	it("returns null when recording an attempt for an invalid choice", async () => {
		const created = await createMcq(userId, {
			name: "Attempt question",
			question: "Attempt question text",
			choices: [
				{ text: "Right", isCorrect: true },
				{ text: "Wrong", isCorrect: false },
			],
		});

		const attempt = await recordMcqAttempt(created.id, userId, "missing-choice");

		expect(attempt).toBeNull();
	});
});
