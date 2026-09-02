import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth/session";

export async function requireApiSession() {
	const session = await getCurrentSession();

	if (!session) {
		return {
			session: null,
			response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}

	return { session, response: null };
}
