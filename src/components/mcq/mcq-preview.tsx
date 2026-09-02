"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MCQ_API_ROUTES } from "@/lib/mcq/routes";
import type { McqWithChoices } from "@/lib/services/mcq";

type McqPreviewProps = {
	mcq: McqWithChoices;
};

export function McqPreview({ mcq }: McqPreviewProps) {
	const [selectedChoiceId, setSelectedChoiceId] = useState<string>("");
	const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			const response = await fetch(MCQ_API_ROUTES.attempts(mcq.id), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ choiceId: selectedChoiceId }),
			});

			const payload = (await response.json()) as {
				attempt?: { isCorrect: boolean };
				error?: string;
			};

			if (!response.ok) {
				setError(payload.error ?? "Unable to record your attempt.");
				return;
			}

			setResult(payload.attempt?.isCorrect ? "correct" : "incorrect");
		} catch {
			setError("Unable to record your attempt.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">{mcq.name}</p>
				<h2 className="text-xl font-semibold">{mcq.question}</h2>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<RadioGroup
					value={selectedChoiceId}
					onValueChange={setSelectedChoiceId}
					disabled={result !== null}
					className="gap-3"
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

				{error ? (
					<p role="alert" className="text-sm text-destructive">
						{error}
					</p>
				) : null}

				{result ? (
					<Badge variant={result === "correct" ? "default" : "destructive"}>
						{result === "correct" ? "Correct" : "Incorrect"}
					</Badge>
				) : (
					<Button type="submit" disabled={!selectedChoiceId || isSubmitting}>
						Submit answer
					</Button>
				)}
			</form>

			<Button variant="outline" render={<Link href="/dashboard/mcqs" />}>
				Back to questions
			</Button>
		</div>
	);
}
