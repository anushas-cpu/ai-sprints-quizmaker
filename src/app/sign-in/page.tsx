import type { Metadata } from "next";

import { SignInForm } from "@/components/auth/sign-in-form";
import { AUTH_ROUTES, getSafeCallbackUrl } from "@/lib/auth/routes";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Sign In | Quiz Maker",
	description: "Sign in to Quiz Maker",
};

type SignInPageProps = {
	searchParams: Promise<{
		registered?: string;
		expired?: string;
		signedOut?: string;
		callbackUrl?: string;
	}>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
	await redirectIfAuthenticated();

	const params = await searchParams;

	return (
		<SignInForm
			callbackUrl={getSafeCallbackUrl(params.callbackUrl ?? AUTH_ROUTES.dashboard)}
			showRegistrationSuccess={params.registered === "1"}
			showSessionExpired={params.expired === "1"}
			showSignedOut={params.signedOut === "1"}
		/>
	);
}
