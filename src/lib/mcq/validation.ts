import { z } from "zod";

const choiceSchema = z.object({
	text: z.string().trim().min(1, "Choice text is required."),
	isCorrect: z.boolean(),
});

export const mcqChoiceInputSchema = choiceSchema;

export const mcqFormSchema = z
	.object({
		name: z.string().trim().min(1, "Question name is required."),
		question: z.string().trim().min(1, "Question text is required."),
		choices: z
			.array(choiceSchema)
			.min(2, "At least two choices are required.")
			.max(6, "A question can have at most six choices."),
	})
	.superRefine((data, ctx) => {
		const correctCount = data.choices.filter((choice) => choice.isCorrect).length;

		if (correctCount !== 1) {
			ctx.addIssue({
				code: "custom",
				message: "Exactly one choice must be marked as correct.",
				path: ["choices"],
			});
		}
	});

export const mcqAttemptSchema = z.object({
	choiceId: z.string().trim().min(1, "A choice is required."),
});

export type McqFormInput = z.infer<typeof mcqFormSchema>;
export type McqChoiceInput = z.infer<typeof mcqChoiceInputSchema>;
export type McqAttemptInput = z.infer<typeof mcqAttemptSchema>;

export type FieldErrors = Record<string, string[]>;

export function flattenZodErrors(error: z.ZodError): FieldErrors {
	return error.issues.reduce<FieldErrors>((acc, issue) => {
		const path = issue.path.length > 0 ? issue.path.join(".") : "form";
		const existing = acc[path] ?? [];
		existing.push(issue.message);
		acc[path] = existing;
		return acc;
	}, {});
}
