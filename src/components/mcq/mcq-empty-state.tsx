import { Plus } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { MCQ_MESSAGES } from "@/lib/mcq/messages";
import { MCQ_ROUTES } from "@/lib/mcq/routes";

export function McqEmptyState() {
	return (
		<div className="flex flex-col items-center gap-4 p-10 text-center">
			<p className="max-w-sm text-sm text-muted-foreground">{MCQ_MESSAGES.list.empty}</p>
			<ButtonLink href={MCQ_ROUTES.new}>
				<Plus />
				Create question
			</ButtonLink>
		</div>
	);
}
