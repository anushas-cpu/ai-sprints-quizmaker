import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/mcq/api-auth";
import {
	deleteMcqHandler,
	getMcqHandler,
	parseJsonBody,
	toJsonResponse,
	updateMcqHandler,
} from "@/lib/mcq/handlers";

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const { id } = await context.params;
	const result = await getMcqHandler(auth.session.user.id, id);
	return toJsonResponse(result);
}

export async function PUT(request: Request, context: RouteContext) {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const { id } = await context.params;
	const body = await parseJsonBody(request);
	if (body === null) {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const result = await updateMcqHandler(auth.session.user.id, id, body);
	return toJsonResponse(result);
}

export async function DELETE(_request: Request, context: RouteContext) {
	const auth = await requireApiSession();
	if (auth.response) {
		return auth.response;
	}

	const { id } = await context.params;
	const result = await deleteMcqHandler(auth.session.user.id, id);
	return toJsonResponse(result);
}
