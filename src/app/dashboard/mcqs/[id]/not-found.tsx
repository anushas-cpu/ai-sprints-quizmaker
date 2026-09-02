import { DashboardShell } from "@/components/mcq/dashboard-shell";
import { McqPageCard } from "@/components/mcq/mcq-page-card";
import { ButtonLink } from "@/components/ui/button";
import { MCQ_ROUTES } from "@/lib/mcq/routes";

export default function McqNotFound() {
	return (
		<DashboardShell
			title="Question not found"
			description="This question may have been deleted or you may not have access to it."
		>
			<McqPageCard>
				<div className="space-y-4 text-sm text-muted-foreground">
					<p>Check the URL or return to your question list.</p>
					<ButtonLink href={MCQ_ROUTES.list}>Back to questions</ButtonLink>
				</div>
			</McqPageCard>
		</DashboardShell>
	);
}
