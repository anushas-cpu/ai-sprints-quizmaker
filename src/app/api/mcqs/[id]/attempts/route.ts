import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/mcq/api-auth";
import { MCQ_MESSAGES } from "@/lib/mcq/messages";
import { mcqAttemptSchema } from "@/lib/mcq/validation";
import { recordMcqAttempt } from "@/lib/services/mcq";

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const { id } = await context.params;

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const parsed = mcqAttemptSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Validation failed.", issues: parsed.error.issues },
			{ status: 400 },
		);
	}

	const attempt = await recordMcqAttempt(id, auth.session.user.id, parsed.data.choiceId);
	if (!attempt) {
		return NextResponse.json(
			{ error: MCQ_MESSAGES.attempt.invalidChoice },
			{ status: 400 },
		);
	}

	return NextResponse.json({ attempt }, { status: 201 });
}
