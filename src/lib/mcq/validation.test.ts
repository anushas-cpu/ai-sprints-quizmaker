import { describe, expect, it } from "vitest";

import { mcqAttemptSchema, mcqFormSchema } from "@/lib/mcq/validation";

const validMcq = {
	name: "Geography",
	question: "What is the capital of France?",
	choices: [
		{ text: "Paris", isCorrect: true },
		{ text: "London", isCorrect: false },
	],
};

describe("mcqFormSchema", () => {
	it("accepts a valid MCQ payload", () => {
		const result = mcqFormSchema.safeParse(validMcq);
		expect(result.success).toBe(true);
	});

	it("rejects when name is missing", () => {
		const result = mcqFormSchema.safeParse({
			...validMcq,
			name: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects when question is missing", () => {
		const result = mcqFormSchema.safeParse({
			...validMcq,
			question: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects fewer than two choices", () => {
		const result = mcqFormSchema.safeParse({
			...validMcq,
			choices: [{ text: "Only one", isCorrect: true }],
		});

		expect(result.success).toBe(false);
	});

	it("rejects more than six choices", () => {
		const result = mcqFormSchema.safeParse({
			...validMcq,
			choices: Array.from({ length: 7 }, (_, index) => ({
				text: `Choice ${index + 1}`,
				isCorrect: index === 0,
			})),
		});

		expect(result.success).toBe(false);
	});

	it("rejects when no choice is marked correct", () => {
		const result = mcqFormSchema.safeParse({
			...validMcq,
			choices: [
				{ text: "Paris", isCorrect: false },
				{ text: "London", isCorrect: false },
			],
		});

		expect(result.success).toBe(false);
	});

	it("rejects when more than one choice is marked correct", () => {
		const result = mcqFormSchema.safeParse({
			...validMcq,
			choices: [
				{ text: "Paris", isCorrect: true },
				{ text: "London", isCorrect: true },
			],
		});

		expect(result.success).toBe(false);
	});
});

describe("mcqAttemptSchema", () => {
	it("accepts a choice id", () => {
		const result = mcqAttemptSchema.safeParse({ choiceId: "choice-1" });
		expect(result.success).toBe(true);
	});

	it("rejects an empty choice id", () => {
		const result = mcqAttemptSchema.safeParse({ choiceId: "" });
		expect(result.success).toBe(false);
	});
});
