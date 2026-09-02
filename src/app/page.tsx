import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/lib/auth/routes";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Home() {
	const session = await getCurrentSession();

	if (session) {
		redirect(AUTH_ROUTES.dashboard);
	}

	redirect(AUTH_ROUTES.signUp);
}
