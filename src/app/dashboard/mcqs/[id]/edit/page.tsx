import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardShell } from "@/components/mcq/dashboard-shell";
import { McqForm } from "@/components/mcq/mcq-form";
import { McqPageCard } from "@/components/mcq/mcq-page-card";
import { requireAuth } from "@/lib/auth/session";
import { MCQ_ROUTES } from "@/lib/mcq/routes";
import { getMcqByIdForUser } from "@/lib/services/mcq";

export const dynamic = "force-dynamic";

type EditMcqPageProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditMcqPageProps): Promise<Metadata> {
	await params;
	return {
		title: "Edit Question | Quiz Maker",
	};
}

export default async function EditMcqPage({ params }: EditMcqPageProps) {
	const { id } = await params;
	const session = await requireAuth(MCQ_ROUTES.edit(id));
	const mcq = await getMcqByIdForUser(id, session.user.id);

	if (!mcq) {
		notFound();
	}

	return (
		<DashboardShell
			title="Edit multiple choice question"
			description="Update the name, question, and choices."
		>
			<McqPageCard>
				<McqForm mode="edit" initialMcq={mcq} />
			</McqPageCard>
		</DashboardShell>
	);
}
