import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
	getCurrentSession: vi.fn(),
}));

vi.mock("@/lib/services/mcq", () => ({
	recordMcqAttempt: vi.fn(),
}));

import { getCurrentSession } from "@/lib/auth/session";
import { recordMcqAttemptAction } from "@/lib/mcq/actions";
import { MCQ_MESSAGES } from "@/lib/mcq/messages";
import { recordMcqAttempt } from "@/lib/services/mcq";

describe("recordMcqAttemptAction", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getCurrentSession).mockResolvedValue({
			session: {
				id: "session-1",
				token: "token",
				expiresAt: new Date(),
				userId: "user-1",
			},
			user: {
				id: "user-1",
				name: "Test User",
				email: "test@example.com",
			},
		});
	});

	it("returns the attempt result for a valid choice", async () => {
		vi.mocked(recordMcqAttempt).mockResolvedValue({
			id: "attempt-1",
			mcqId: "mcq-1",
			choiceId: "choice-1",
			isCorrect: true,
			userId: "user-1",
			createdAt: new Date(),
		});

		const formData = new FormData();
		formData.set("choiceId", "choice-1");

		const result = await recordMcqAttemptAction("mcq-1", {}, formData);

		expect(result).toEqual({ result: "correct" });
	});

	it("returns an error for an invalid choice", async () => {
		vi.mocked(recordMcqAttempt).mockResolvedValue(null);

		const formData = new FormData();
		formData.set("choiceId", "missing");

		const result = await recordMcqAttemptAction("mcq-1", {}, formData);

		expect(result).toEqual({ error: MCQ_MESSAGES.attempt.invalidChoice });
	});
});
