/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
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
	createMcqAction: vi.fn(),
	updateMcqAction: vi.fn(),
}));

import { McqForm } from "@/components/mcq/mcq-form";

afterEach(() => {
	cleanup();
});

describe("McqForm", () => {
	it("renders name, question, and two default choices", () => {
		render(<McqForm mode="create" />);

		expect(screen.getByLabelText(/question name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/^question$/i)).toBeInTheDocument();
		expect(screen.getAllByPlaceholderText("Choice 1")[0]).toBeInTheDocument();
		expect(screen.getAllByPlaceholderText("Choice 2")[0]).toBeInTheDocument();
	});

	it("allows adding and removing choices within limits", async () => {
		const user = userEvent.setup();
		render(<McqForm mode="create" />);

		await user.click(screen.getAllByRole("button", { name: /add choice/i })[0]);
		expect(screen.getAllByPlaceholderText("Choice 3")[0]).toBeInTheDocument();

		const removeButtons = screen.getAllByRole("button", { name: /remove choice/i });
		await user.click(removeButtons[2]);
		expect(screen.queryByPlaceholderText("Choice 3")).not.toBeInTheDocument();
	});

	it("prefills fields when editing an existing question", () => {
		render(
			<McqForm
				mode="edit"
				initialMcq={{
					id: "mcq-1",
					name: "Geography",
					question: "What is the capital of France?",
					createdAt: new Date(),
					updatedAt: new Date(),
					choices: [
						{ id: "c1", text: "Paris", isCorrect: true, sortOrder: 0 },
						{ id: "c2", text: "London", isCorrect: false, sortOrder: 1 },
					],
				}}
			/>,
		);

		expect(screen.getAllByLabelText(/question name/i)[0]).toHaveValue("Geography");
		expect(screen.getAllByLabelText(/^question$/i)[0]).toHaveValue(
			"What is the capital of France?",
		);
		expect(screen.getAllByPlaceholderText("Choice 1")[0]).toHaveValue("Paris");
	});
});
