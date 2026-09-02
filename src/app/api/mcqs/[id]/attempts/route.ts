import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/mcq/api-auth";
import { parseJsonBody, recordMcqAttemptHandler, toJsonResponse } from "@/lib/mcq/handlers";

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const { id } = await context.params;
	const body = await parseJsonBody(request);
	if (body === null) {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const result = await recordMcqAttemptHandler(auth.session.user.id, id, body);
	return toJsonResponse(result);
}
