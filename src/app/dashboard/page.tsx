import type { Metadata } from "next";
import { DashboardShell } from "@/components/mcq/dashboard-shell";
import { McqPageCard } from "@/components/mcq/mcq-page-card";
import { ButtonLink } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/session";
import { MCQ_ROUTES } from "@/lib/mcq/routes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Dashboard | Quiz Maker",
	description: "Quiz Maker dashboard",
};

export default async function DashboardPage() {
	const session = await requireAuth("/dashboard");
	const name = session.user.name;
	const email = session.user.email;

	return (
		<DashboardShell
			title={`Welcome${name ? `, ${name}` : ""}`}
			description={email ?? undefined}
		>
			<McqPageCard>
				<h2 className="text-lg font-medium">Get started</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					Create and manage multiple choice questions for your quizzes.
				</p>
				<ButtonLink className="mt-4" href={MCQ_ROUTES.list}>
					Manage questions
				</ButtonLink>
			</McqPageCard>
		</DashboardShell>
	);
}
