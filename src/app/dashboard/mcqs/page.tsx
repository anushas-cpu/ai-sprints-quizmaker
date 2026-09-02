import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { DashboardShell } from "@/components/mcq/dashboard-shell";
import { McqEmptyState } from "@/components/mcq/mcq-empty-state";
import { McqPageCard } from "@/components/mcq/mcq-page-card";
import { McqTable } from "@/components/mcq/mcq-table";
import { ButtonLink } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/session";
import { MCQ_ROUTES } from "@/lib/mcq/routes";
import { listMcqsByUser } from "@/lib/services/mcq";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Multiple Choice Questions | Quiz Maker",
	description: "Manage multiple choice questions",
};

export default async function McqListPage() {
	const session = await requireAuth(MCQ_ROUTES.list);
	const mcqs = await listMcqsByUser(session.user.id);

	return (
		<DashboardShell
			title="Multiple choice questions"
			description="Create, edit, preview, and delete your questions."
			action={
				<ButtonLink href={MCQ_ROUTES.new}>
					<Plus />
					New question
				</ButtonLink>
			}
		>
			<McqPageCard>
				{mcqs.length === 0 ? <McqEmptyState /> : <McqTable mcqs={mcqs} />}
			</McqPageCard>
		</DashboardShell>
	);
}
