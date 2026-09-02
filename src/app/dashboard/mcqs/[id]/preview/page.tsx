import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardShell } from "@/components/mcq/dashboard-shell";
import { McqPreview } from "@/components/mcq/mcq-preview";
import { requireAuth } from "@/lib/auth/session";
import { MCQ_ROUTES } from "@/lib/mcq/routes";
import { getMcqByIdForUser } from "@/lib/services/mcq";

export const dynamic = "force-dynamic";

type PreviewMcqPageProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PreviewMcqPageProps): Promise<Metadata> {
	const { id } = await params;
	return {
		title: `Preview Question ${id} | Quiz Maker`,
		description: "Preview a multiple choice question",
	};
}

export default async function PreviewMcqPage({ params }: PreviewMcqPageProps) {
	const { id } = await params;
	const session = await requireAuth(MCQ_ROUTES.preview(id));
	const mcq = await getMcqByIdForUser(id, session.user.id);

	if (!mcq) {
		notFound();
	}

	return (
		<DashboardShell
			title="Preview question"
			description="Try answering this question. Your attempt will be recorded."
		>
			<div className="rounded-xl border bg-card p-6 ring-1 ring-foreground/10">
				<McqPreview mcq={mcq} />
			</div>
		</DashboardShell>
	);
}
