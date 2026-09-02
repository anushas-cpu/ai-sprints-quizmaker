"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentSession } from "@/lib/auth/session";
import { MCQ_MESSAGES } from "@/lib/mcq/messages";
import { MCQ_ROUTES } from "@/lib/mcq/routes";
import { flattenZodErrors, mcqFormSchema, type FieldErrors } from "@/lib/mcq/validation";
import {
	createMcq,
	deleteMcq,
	updateMcq,
} from "@/lib/services/mcq";

export type McqFormState = {
	errors?: FieldErrors;
	formError?: string;
};

function parseChoicesFromFormData(formData: FormData) {
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

function parseMcqFormData(formData: FormData) {
	return mcqFormSchema.safeParse({
		name: formData.get("name"),
		question: formData.get("question"),
		choices: parseChoicesFromFormData(formData),
	});
}

async function requireUserId(): Promise<string | null> {
	const session = await getCurrentSession();
	return session?.user.id ?? null;
}

export async function createMcqAction(
	_prevState: McqFormState,
	formData: FormData,
): Promise<McqFormState> {
	const userId = await requireUserId();
	if (!userId) {
		redirect("/sign-in");
	}

	const parsed = parseMcqFormData(formData);
	if (!parsed.success) {
		return { errors: flattenZodErrors(parsed.error) };
	}

	try {
		await createMcq(userId, parsed.data);
	} catch {
		return { formError: MCQ_MESSAGES.form.serverError };
	}

	revalidatePath(MCQ_ROUTES.list);
	redirect(MCQ_ROUTES.list);
}

export async function updateMcqAction(
	mcqId: string,
	_prevState: McqFormState,
	formData: FormData,
): Promise<McqFormState> {
	const userId = await requireUserId();
	if (!userId) {
		redirect("/sign-in");
	}

	const parsed = parseMcqFormData(formData);
	if (!parsed.success) {
		return { errors: flattenZodErrors(parsed.error) };
	}

	try {
		const updated = await updateMcq(mcqId, userId, parsed.data);
		if (!updated) {
			return { formError: MCQ_MESSAGES.form.notFound };
		}
	} catch {
		return { formError: MCQ_MESSAGES.form.serverError };
	}

	revalidatePath(MCQ_ROUTES.list);
	redirect(MCQ_ROUTES.list);
}

export async function deleteMcqAction(mcqId: string): Promise<void> {
	const userId = await requireUserId();
	if (!userId) {
		redirect("/sign-in");
	}

	try {
		await deleteMcq(mcqId, userId);
	} catch {
		throw new Error(MCQ_MESSAGES.delete.serverError);
	}

	revalidatePath(MCQ_ROUTES.list);
	redirect(MCQ_ROUTES.list);
}
