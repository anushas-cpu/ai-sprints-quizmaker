import { describe, expect, it } from "vitest";

import { parseChoicesFromFormData, parseMcqFormData } from "@/lib/mcq/form";

function buildFormData(entries: Record<string, string>) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(entries)) {
		formData.set(key, value);
	}
	return formData;
}

describe("parseChoicesFromFormData", () => {
	it("maps choice fields and marks the selected index as correct", () => {
		const formData = buildFormData({
			choiceCount: "3",
			correctChoiceIndex: "1",
			choiceText_0: "One",
			choiceText_1: "Two",
			choiceText_2: "Three",
		});

		expect(parseChoicesFromFormData(formData)).toEqual([
			{ text: "One", isCorrect: false },
			{ text: "Two", isCorrect: true },
			{ text: "Three", isCorrect: false },
		]);
	});
});

describe("parseMcqFormData", () => {
	it("parses a valid MCQ form submission", () => {
		const formData = buildFormData({
			name: "Geography",
			question: "What is the capital of France?",
			choiceCount: "2",
			correctChoiceIndex: "0",
			choiceText_0: "Paris",
			choiceText_1: "London",
		});

		const result = parseMcqFormData(formData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe("Geography");
			expect(result.data.question).toBe("What is the capital of France?");
			expect(result.data.choices).toEqual([
				{ text: "Paris", isCorrect: true },
				{ text: "London", isCorrect: false },
			]);
		}
	});

	it("returns validation errors for invalid submissions", () => {
		const formData = buildFormData({
			name: "",
			question: "",
			choiceCount: "1",
			correctChoiceIndex: "0",
			choiceText_0: "Only one",
		});

		const result = parseMcqFormData(formData);
		expect(result.success).toBe(false);
	});
});
