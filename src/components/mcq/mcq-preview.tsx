"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	recordMcqAttemptAction,
	type McqAttemptState,
} from "@/lib/mcq/actions";
import { MCQ_ROUTES } from "@/lib/mcq/routes";
import type { McqWithChoices } from "@/lib/services/mcq";

type McqPreviewProps = {
	mcq: McqWithChoices;
};

const initialAttemptState: McqAttemptState = {};

function McqPreviewForm({
	mcq,
	onTryAgain,
}: {
	mcq: McqWithChoices;
	onTryAgain: () => void;
}) {
	const action = useMemo(
		() => recordMcqAttemptAction.bind(null, mcq.id),
		[mcq.id],
	);
	const [state, formAction, isPending] = useActionState(action, initialAttemptState);
	const [selectedChoiceId, setSelectedChoiceId] = useState("");
	const isSubmitted = state.result !== undefined;

	return (
		<>
			<form action={formAction} className="space-y-4" aria-label="Answer form">
				<input type="hidden" name="choiceId" value={selectedChoiceId} />

				<RadioGroup
					value={selectedChoiceId}
					onValueChange={setSelectedChoiceId}
					disabled={isSubmitted || isPending}
					className="gap-3"
					aria-label="Answer choices"
				>
					{mcq.choices.map((choice) => (
						<div
							key={choice.id}
							className="flex items-center gap-3 rounded-lg border p-3"
						>
							<RadioGroupItem value={choice.id} id={choice.id} />
							<Label htmlFor={choice.id}>{choice.text}</Label>
						</div>
					))}
				</RadioGroup>

				{state.error ? (
					<p role="alert" className="text-sm text-destructive">
						{state.error}
					</p>
				) : null}

				{state.result ? (
					<div className="flex flex-wrap items-center gap-3">
						<Badge variant={state.result === "correct" ? "success" : "destructive"}>
							{state.result === "correct" ? "Correct" : "Incorrect"}
						</Badge>
						<Button type="button" variant="outline" size="sm" onClick={onTryAgain}>
							Try again
						</Button>
					</div>
				) : (
					<Button type="submit" disabled={!selectedChoiceId || isPending}>
						{isPending ? <Loader2 className="animate-spin" /> : null}
						Submit answer
					</Button>
				)}
			</form>
		</>
	);
}

export function McqPreview({ mcq }: McqPreviewProps) {
	const [attemptKey, setAttemptKey] = useState(0);

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">{mcq.name}</p>
				<h2 className="text-xl font-semibold">{mcq.question}</h2>
			</div>

			<McqPreviewForm
				key={attemptKey}
				mcq={mcq}
				onTryAgain={() => setAttemptKey((current) => current + 1)}
			/>

			<ButtonLink variant="outline" href={MCQ_ROUTES.list}>
				Back to questions
			</ButtonLink>
		</div>
	);
}
