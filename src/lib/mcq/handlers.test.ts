import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/mcq", () => ({
	createMcq: vi.fn(),
	deleteMcq: vi.fn(),
	getMcqByIdForUser: vi.fn(),
	listMcqsByUser: vi.fn(),
	recordMcqAttempt: vi.fn(),
	updateMcq: vi.fn(),
}));

import { MCQ_MESSAGES } from "@/lib/mcq/messages";
import {
	createMcqHandler,
	deleteMcqHandler,
	getMcqHandler,
	listMcqsHandler,
	recordMcqAttemptHandler,
	updateMcqHandler,
} from "@/lib/mcq/handlers";
import {
	createMcq,
	deleteMcq,
	getMcqByIdForUser,
	listMcqsByUser,
	recordMcqAttempt,
	updateMcq,
} from "@/lib/services/mcq";

const validPayload = {
	name: "Geography",
	question: "What is the capital of France?",
	choices: [
		{ text: "Paris", isCorrect: true },
		{ text: "London", isCorrect: false },
	],
};

const sampleMcq = {
	id: "mcq-1",
	name: "Geography",
	question: "What is the capital of France?",
	createdAt: new Date("2026-09-02T00:00:00.000Z"),
	updatedAt: new Date("2026-09-02T00:00:00.000Z"),
	choices: [
		{ id: "choice-1", text: "Paris", isCorrect: true, sortOrder: 0 },
		{ id: "choice-2", text: "London", isCorrect: false, sortOrder: 1 },
	],
};

describe("mcq API handlers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lists MCQs for the authenticated user", async () => {
		vi.mocked(listMcqsByUser).mockResolvedValue([sampleMcq]);

		const result = await listMcqsHandler("user-1");

		expect(result).toEqual({
			ok: true,
			status: 200,
			data: { mcqs: [sampleMcq] },
		});
	});

	it("creates an MCQ from a valid payload", async () => {
		vi.mocked(createMcq).mockResolvedValue(sampleMcq);

		const result = await createMcqHandler("user-1", validPayload);

		expect(result).toEqual({
			ok: true,
			status: 201,
			data: { mcq: sampleMcq },
		});
	});

	it("returns validation errors for invalid create payloads", async () => {
		const result = await createMcqHandler("user-1", {
			...validPayload,
			choices: [{ text: "Only one", isCorrect: true }],
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.status).toBe(400);
			expect(result.body.error).toBe("Validation failed.");
		}
	});

	it("returns not found when reading a missing MCQ", async () => {
		vi.mocked(getMcqByIdForUser).mockResolvedValue(null);

		const result = await getMcqHandler("user-1", "missing");

		expect(result).toEqual({
			ok: false,
			status: 404,
			body: { error: MCQ_MESSAGES.form.notFound },
		});
	});

	it("updates an existing MCQ", async () => {
		vi.mocked(updateMcq).mockResolvedValue(sampleMcq);

		const result = await updateMcqHandler("user-1", "mcq-1", validPayload);

		expect(result).toEqual({
			ok: true,
			status: 200,
			data: { mcq: sampleMcq },
		});
	});

	it("deletes an existing MCQ", async () => {
		vi.mocked(deleteMcq).mockResolvedValue(true);

		const result = await deleteMcqHandler("user-1", "mcq-1");

		expect(result).toEqual({
			ok: true,
			status: 200,
			data: { success: true },
		});
	});

	it("records a valid attempt", async () => {
		const attempt = {
			id: "attempt-1",
			mcqId: "mcq-1",
			choiceId: "choice-1",
			isCorrect: true,
			userId: "user-1",
			createdAt: new Date("2026-09-02T00:00:00.000Z"),
		};
		vi.mocked(recordMcqAttempt).mockResolvedValue(attempt);

		const result = await recordMcqAttemptHandler("user-1", "mcq-1", {
			choiceId: "choice-1",
		});

		expect(result).toEqual({
			ok: true,
			status: 201,
			data: { attempt },
		});
	});

	it("returns a client error for an invalid attempt choice", async () => {
		vi.mocked(recordMcqAttempt).mockResolvedValue(null);

		const result = await recordMcqAttemptHandler("user-1", "mcq-1", {
			choiceId: "missing",
		});

		expect(result).toEqual({
			ok: false,
			status: 400,
			body: { error: MCQ_MESSAGES.attempt.invalidChoice },
		});
	});
});
