import type { Metadata } from "next";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Sign Up | Quiz Maker",
	description: "Create a Quiz Maker account",
};

export default async function SignUpPage() {
	await redirectIfAuthenticated();

	return <SignUpForm />;
}
