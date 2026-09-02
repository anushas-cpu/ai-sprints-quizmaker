import type { Metadata } from "next";

import { DashboardShell } from "@/components/mcq/dashboard-shell";
import { McqForm } from "@/components/mcq/mcq-form";

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
			<div className="rounded-xl border bg-card p-6 ring-1 ring-foreground/10">
				<McqForm mode="create" />
			</div>
		</DashboardShell>
	);
}
