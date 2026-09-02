import type { ZodIssue } from "zod";

import { MCQ_MESSAGES } from "@/lib/mcq/messages";
import { mcqAttemptSchema, mcqFormSchema } from "@/lib/mcq/validation";
import {
	createMcq,
	deleteMcq,
	getMcqByIdForUser,
	listMcqsByUser,
	recordMcqAttempt,
	updateMcq,
	type McqAttempt,
	type McqSummary,
	type McqWithChoices,
} from "@/lib/services/mcq";

export type McqApiError = {
	error: string;
	issues?: ZodIssue[];
};

export type McqApiResult<T> =
	| { ok: true; status: number; data: T }
	| { ok: false; status: number; body: McqApiError };

function validationError(issues: ZodIssue[]): McqApiResult<never> {
	return {
		ok: false,
		status: 400,
		body: { error: "Validation failed.", issues },
	};
}

export async function listMcqsHandler(userId: string): Promise<McqApiResult<{ mcqs: McqSummary[] }>> {
	try {
		const mcqs = await listMcqsByUser(userId);
		return { ok: true, status: 200, data: { mcqs } };
	} catch {
		return {
			ok: false,
			status: 500,
			body: { error: MCQ_MESSAGES.form.serverError },
		};
	}
}

export async function createMcqHandler(
	userId: string,
	body: unknown,
): Promise<McqApiResult<{ mcq: McqWithChoices }>> {
	const parsed = mcqFormSchema.safeParse(body);
	if (!parsed.success) {
		return validationError(parsed.error.issues);
	}

	try {
		const mcq = await createMcq(userId, parsed.data);
		return { ok: true, status: 201, data: { mcq } };
	} catch {
		return {
			ok: false,
			status: 500,
			body: { error: MCQ_MESSAGES.form.serverError },
		};
	}
}

export async function getMcqHandler(
	userId: string,
	mcqId: string,
): Promise<McqApiResult<{ mcq: McqWithChoices }>> {
	try {
		const mcq = await getMcqByIdForUser(mcqId, userId);
		if (!mcq) {
			return {
				ok: false,
				status: 404,
				body: { error: MCQ_MESSAGES.form.notFound },
			};
		}

		return { ok: true, status: 200, data: { mcq } };
	} catch {
		return {
			ok: false,
			status: 500,
			body: { error: MCQ_MESSAGES.form.serverError },
		};
	}
}

export async function updateMcqHandler(
	userId: string,
	mcqId: string,
	body: unknown,
): Promise<McqApiResult<{ mcq: McqWithChoices }>> {
	const parsed = mcqFormSchema.safeParse(body);
	if (!parsed.success) {
		return validationError(parsed.error.issues);
	}

	try {
		const mcq = await updateMcq(mcqId, userId, parsed.data);
		if (!mcq) {
			return {
				ok: false,
				status: 404,
				body: { error: MCQ_MESSAGES.form.notFound },
			};
		}

		return { ok: true, status: 200, data: { mcq } };
	} catch {
		return {
			ok: false,
			status: 500,
			body: { error: MCQ_MESSAGES.form.serverError },
		};
	}
}

export async function deleteMcqHandler(
	userId: string,
	mcqId: string,
): Promise<McqApiResult<{ success: true }>> {
	try {
		const deleted = await deleteMcq(mcqId, userId);
		if (!deleted) {
			return {
				ok: false,
				status: 404,
				body: { error: MCQ_MESSAGES.form.notFound },
			};
		}

		return { ok: true, status: 200, data: { success: true } };
	} catch {
		return {
			ok: false,
			status: 500,
			body: { error: MCQ_MESSAGES.delete.serverError },
		};
	}
}

export async function recordMcqAttemptHandler(
	userId: string,
	mcqId: string,
	body: unknown,
): Promise<McqApiResult<{ attempt: McqAttempt }>> {
	const parsed = mcqAttemptSchema.safeParse(body);
	if (!parsed.success) {
		return validationError(parsed.error.issues);
	}

	try {
		const attempt = await recordMcqAttempt(mcqId, userId, parsed.data.choiceId);
		if (!attempt) {
			return {
				ok: false,
				status: 400,
				body: { error: MCQ_MESSAGES.attempt.invalidChoice },
			};
		}

		return { ok: true, status: 201, data: { attempt } };
	} catch {
		return {
			ok: false,
			status: 500,
			body: { error: MCQ_MESSAGES.attempt.serverError },
		};
	}
}

export function toJsonResponse(result: McqApiResult<unknown>) {
	if (result.ok) {
		return Response.json(result.data, { status: result.status });
	}

	return Response.json(result.body, { status: result.status });
}

export async function parseJsonBody(request: Request): Promise<unknown | null> {
	try {
		return await request.json();
	} catch {
		return null;
	}
}
