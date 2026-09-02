"use client";

import Link from "next/link";
import { Loader2, Minus, Plus } from "lucide-react";
import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
	createMcqAction,
	updateMcqAction,
	type McqFormState,
} from "@/lib/mcq/actions";
import { MCQ_ROUTES } from "@/lib/mcq/routes";
import type { McqWithChoices } from "@/lib/services/mcq";

const MIN_CHOICES = 2;
const MAX_CHOICES = 6;

type ChoiceField = {
	text: string;
};

type McqFormProps = {
	mode: "create" | "edit";
	initialMcq?: McqWithChoices;
};

function getFieldErrors(errors: McqFormState["errors"], field: string) {
	const messages = errors?.[field];
	return messages?.map((message) => ({ message }));
}

function buildInitialChoices(initialMcq?: McqWithChoices): ChoiceField[] {
	if (initialMcq?.choices.length) {
		return initialMcq.choices.map((choice) => ({ text: choice.text }));
	}

	return [{ text: "" }, { text: "" }];
}

function getInitialCorrectIndex(initialMcq?: McqWithChoices) {
	if (!initialMcq?.choices.length) {
		return 0;
	}

	const index = initialMcq.choices.findIndex((choice) => choice.isCorrect);
	return index >= 0 ? index : 0;
}

export function McqForm({ mode, initialMcq }: McqFormProps) {
	const action = useMemo(
		() =>
			mode === "create"
				? createMcqAction
				: updateMcqAction.bind(null, initialMcq!.id),
		[mode, initialMcq],
	);
	const [state, formAction, isPending] = useActionState(action, {});
	const [choices, setChoices] = useState<ChoiceField[]>(() => buildInitialChoices(initialMcq));
	const [correctChoiceIndex, setCorrectChoiceIndex] = useState(() =>
		getInitialCorrectIndex(initialMcq),
	);

	const choiceError = getFieldErrors(state.errors, "choices");

	function addChoice() {
		if (choices.length >= MAX_CHOICES) {
			return;
		}

		setChoices((current) => [...current, { text: "" }]);
	}

	function removeChoice(index: number) {
		if (choices.length <= MIN_CHOICES) {
			return;
		}

		setChoices((current) => current.filter((_, choiceIndex) => choiceIndex !== index));
		setCorrectChoiceIndex((current) => {
			if (index === current) {
				return 0;
			}

			if (index < current) {
				return current - 1;
			}

			return current;
		});
	}

	return (
		<form action={formAction} noValidate className="space-y-6">
			<input type="hidden" name="choiceCount" value={choices.length} />
			<input type="hidden" name="correctChoiceIndex" value={correctChoiceIndex} />

			<FieldGroup>
				<Field data-invalid={Boolean(state.errors?.name)}>
					<FieldLabel htmlFor="name">Question name</FieldLabel>
					<Input
						id="name"
						name="name"
						defaultValue={initialMcq?.name ?? ""}
						aria-invalid={Boolean(state.errors?.name)}
						required
					/>
					<FieldError errors={getFieldErrors(state.errors, "name")} />
				</Field>

				<Field data-invalid={Boolean(state.errors?.question)}>
					<FieldLabel htmlFor="question">Question</FieldLabel>
					<Textarea
						id="question"
						name="question"
						defaultValue={initialMcq?.question ?? ""}
						placeholder="Enter the question learners will answer"
						aria-invalid={Boolean(state.errors?.question)}
						required
					/>
					<FieldError errors={getFieldErrors(state.errors, "question")} />
				</Field>

				<div className="space-y-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h2 className="text-sm font-medium">Choices</h2>
							<p className="text-sm text-muted-foreground">
								Add between two and six choices and mark exactly one as correct.
							</p>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={addChoice}
							disabled={choices.length >= MAX_CHOICES}
						>
							<Plus />
							Add choice
						</Button>
					</div>

					<RadioGroup
						value={String(correctChoiceIndex)}
						onValueChange={(value) => setCorrectChoiceIndex(Number(value))}
						className="gap-4"
					>
						{choices.map((choice, index) => (
							<div
								key={`choice-${index}`}
								className="flex items-start gap-3 rounded-lg border p-3"
							>
								<div className="flex items-center gap-2 pt-2">
									<RadioGroupItem value={String(index)} id={`correct-${index}`} />
									<Label htmlFor={`correct-${index}`} className="text-xs text-muted-foreground">
										Correct
									</Label>
								</div>
								<div className="flex-1 space-y-2">
									<Input
										name={`choiceText_${index}`}
										defaultValue={choice.text}
										placeholder={`Choice ${index + 1}`}
										aria-label={`Choice ${index + 1}`}
										required
									/>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={() => removeChoice(index)}
									disabled={choices.length <= MIN_CHOICES}
									aria-label={`Remove choice ${index + 1}`}
								>
									<Minus />
								</Button>
							</div>
						))}
					</RadioGroup>

					<FieldError errors={choiceError} />
				</div>

				{state.formError ? (
					<p role="alert" className="text-sm text-destructive">
						{state.formError}
					</p>
				) : null}
			</FieldGroup>

			<div className="flex items-center gap-3">
				<Button type="submit" disabled={isPending}>
					{isPending ? <Loader2 className="animate-spin" /> : null}
					Save
				</Button>
				<Button variant="outline" render={<Link href={MCQ_ROUTES.list} />}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
