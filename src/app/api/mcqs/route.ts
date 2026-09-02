import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/mcq/api-auth";
import { mcqFormSchema } from "@/lib/mcq/validation";
import { createMcq, listMcqsByUser } from "@/lib/services/mcq";

export async function GET() {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const mcqs = await listMcqsByUser(auth.session.user.id);
	return NextResponse.json({ mcqs });
}

export async function POST(request: Request) {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

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

	const mcq = await createMcq(auth.session.user.id, parsed.data);
	return NextResponse.json({ mcq }, { status: 201 });
}
