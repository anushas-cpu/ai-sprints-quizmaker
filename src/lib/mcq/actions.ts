"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { buildSignInUrl } from "@/lib/auth/routes";
import { getCurrentSession } from "@/lib/auth/session";
import { parseMcqFormData } from "@/lib/mcq/form";
import { MCQ_MESSAGES } from "@/lib/mcq/messages";
import { MCQ_ROUTES } from "@/lib/mcq/routes";
import { flattenZodErrors, mcqAttemptSchema, type FieldErrors } from "@/lib/mcq/validation";
import {
	createMcq,
	deleteMcq,
	recordMcqAttempt,
	updateMcq,
} from "@/lib/services/mcq";

export type McqFormState = {
	errors?: FieldErrors;
	formError?: string;
};

export type McqAttemptState = {
	error?: string;
	result?: "correct" | "incorrect";
};

async function requireUserId(callbackPath: string): Promise<string> {
	const session = await getCurrentSession();
	if (!session) {
		redirect(buildSignInUrl({ callbackUrl: callbackPath }));
	}

	return session.user.id;
}

export async function createMcqAction(
	_prevState: McqFormState,
	formData: FormData,
): Promise<McqFormState> {
	const userId = await requireUserId(MCQ_ROUTES.new);
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
	const userId = await requireUserId(MCQ_ROUTES.edit(mcqId));
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
	const userId = await requireUserId(MCQ_ROUTES.list);

	try {
		const deleted = await deleteMcq(mcqId, userId);
		if (!deleted) {
			throw new Error(MCQ_MESSAGES.form.notFound);
		}
	} catch (error) {
		if (error instanceof Error && error.message === MCQ_MESSAGES.form.notFound) {
			throw error;
		}

		throw new Error(MCQ_MESSAGES.delete.serverError);
	}

	revalidatePath(MCQ_ROUTES.list);
	redirect(MCQ_ROUTES.list);
}

export async function recordMcqAttemptAction(
	mcqId: string,
	_prevState: McqAttemptState,
	formData: FormData,
): Promise<McqAttemptState> {
	const userId = await requireUserId(MCQ_ROUTES.preview(mcqId));
	const parsed = mcqAttemptSchema.safeParse({
		choiceId: formData.get("choiceId"),
	});

	if (!parsed.success) {
		return { error: MCQ_MESSAGES.attempt.invalidChoice };
	}

	try {
		const attempt = await recordMcqAttempt(mcqId, userId, parsed.data.choiceId);
		if (!attempt) {
			return { error: MCQ_MESSAGES.attempt.invalidChoice };
		}

		return { result: attempt.isCorrect ? "correct" : "incorrect" };
	} catch {
		return { error: MCQ_MESSAGES.attempt.serverError };
	}
}
