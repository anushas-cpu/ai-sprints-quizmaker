import { mcqFormSchema } from "@/lib/mcq/validation";

export function parseChoicesFromFormData(formData: FormData) {
	const choiceCount = Number(formData.get("choiceCount") ?? "0");
	const correctIndex = Number(formData.get("correctChoiceIndex") ?? "-1");
	const choices = [];

	for (let index = 0; index < choiceCount; index += 1) {
		const text = String(formData.get(`choiceText_${index}`) ?? "");
		choices.push({
			text,
			isCorrect: index === correctIndex,
		});
	}

	return choices;
}

export function parseMcqFormData(formData: FormData) {
	return mcqFormSchema.safeParse({
		name: formData.get("name"),
		question: formData.get("question"),
		choices: parseChoicesFromFormData(formData),
	});
}
