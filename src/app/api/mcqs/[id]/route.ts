import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/mcq/api-auth";
import { mcqFormSchema } from "@/lib/mcq/validation";
import { deleteMcq, getMcqByIdForUser, updateMcq } from "@/lib/services/mcq";

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const { id } = await context.params;
	const mcq = await getMcqByIdForUser(id, auth.session.user.id);

	if (!mcq) {
		return NextResponse.json({ error: "MCQ not found." }, { status: 404 });
	}

	return NextResponse.json({ mcq });
}

export async function PUT(request: Request, context: RouteContext) {
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

	const parsed = mcqFormSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Validation failed.", issues: parsed.error.issues },
			{ status: 400 },
		);
	}

	const mcq = await updateMcq(id, auth.session.user.id, parsed.data);
	if (!mcq) {
		return NextResponse.json({ error: "MCQ not found." }, { status: 404 });
	}

	return NextResponse.json({ mcq });
}

export async function DELETE(_request: Request, context: RouteContext) {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const { id } = await context.params;
	const deleted = await deleteMcq(id, auth.session.user.id);

	if (!deleted) {
		return NextResponse.json({ error: "MCQ not found." }, { status: 404 });
	}

	return NextResponse.json({ success: true });
}
