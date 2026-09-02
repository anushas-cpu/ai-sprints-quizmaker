import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardShell } from "@/components/mcq/dashboard-shell";
import { McqForm } from "@/components/mcq/mcq-form";
import { requireAuth } from "@/lib/auth/session";
import { MCQ_ROUTES } from "@/lib/mcq/routes";
import { getMcqByIdForUser } from "@/lib/services/mcq";

export const dynamic = "force-dynamic";

type EditMcqPageProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditMcqPageProps): Promise<Metadata> {
	const { id } = await params;
	return {
		title: `Edit Question ${id} | Quiz Maker`,
		description: "Edit a multiple choice question",
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
			<div className="rounded-xl border bg-card p-6 ring-1 ring-foreground/10">
				<McqForm mode="edit" initialMcq={mcq} />
			</div>
		</DashboardShell>
	);
}
