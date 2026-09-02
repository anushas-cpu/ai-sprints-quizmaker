import type { Metadata } from "next";

import { DashboardShell } from "@/components/mcq/dashboard-shell";
import { McqForm } from "@/components/mcq/mcq-form";
import { McqPageCard } from "@/components/mcq/mcq-page-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "New Question | Quiz Maker",
	description: "Create a multiple choice question",
};

export default function NewMcqPage() {
	return (
		<DashboardShell
			title="New multiple choice question"
			description="Add a name, question text, and between two and six choices."
		>
			<McqPageCard>
				<McqForm mode="create" />
			</McqPageCard>
		</DashboardShell>
	);
}
