/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
	default: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode;
		href: string;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock("@/lib/mcq/actions", () => ({
	recordMcqAttemptAction: vi.fn(),
}));

import { McqPreview } from "@/components/mcq/mcq-preview";

const sampleMcq = {
	id: "mcq-1",
	name: "Geography",
	question: "What is the capital of France?",
	createdAt: new Date(),
	updatedAt: new Date(),
	choices: [
		{ id: "choice-1", text: "Paris", isCorrect: true, sortOrder: 0 },
		{ id: "choice-2", text: "London", isCorrect: false, sortOrder: 1 },
	],
};

afterEach(() => {
	cleanup();
});

describe("McqPreview", () => {
	it("renders the question and choices", () => {
		render(<McqPreview mcq={sampleMcq} />);

		expect(screen.getByText("Geography")).toBeInTheDocument();
		expect(screen.getByText("What is the capital of France?")).toBeInTheDocument();
		expect(screen.getAllByRole("radio", { name: "Paris" })[0]).toBeInTheDocument();
		expect(screen.getAllByRole("radio", { name: "London" })[0]).toBeInTheDocument();
	});

	it("keeps submit disabled until a choice is selected", async () => {
		const user = userEvent.setup();
		render(<McqPreview mcq={sampleMcq} />);

		const form = screen.getAllByRole("form", { name: /answer form/i })[0];
		const submitButton = within(form).getByRole("button", { name: /submit answer/i });
		expect(submitButton).toBeDisabled();

		await user.click(screen.getAllByRole("radio", { name: "Paris" })[0]);
		expect(submitButton).toBeEnabled();
	});
});
