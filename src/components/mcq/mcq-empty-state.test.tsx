/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

import { McqEmptyState } from "@/components/mcq/mcq-empty-state";
import { MCQ_MESSAGES } from "@/lib/mcq/messages";
import { MCQ_ROUTES } from "@/lib/mcq/routes";

describe("McqEmptyState", () => {
	it("shows the empty message and create link", () => {
		render(<McqEmptyState />);

		expect(screen.getByText(MCQ_MESSAGES.list.empty)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /create question/i })).toHaveAttribute(
			"href",
			MCQ_ROUTES.new,
		);
	});
});
