import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/mcq/api-auth";
import {
	createMcqHandler,
	listMcqsHandler,
	parseJsonBody,
	toJsonResponse,
} from "@/lib/mcq/handlers";

export async function GET() {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const result = await listMcqsHandler(auth.session.user.id);
	return toJsonResponse(result);
}

export async function POST(request: Request) {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const body = await parseJsonBody(request);
	if (body === null) {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const result = await createMcqHandler(auth.session.user.id, body);
	return toJsonResponse(result);
}
