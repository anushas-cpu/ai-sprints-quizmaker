import type { Metadata } from "next";
import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth/session";
import { MCQ_ROUTES } from "@/lib/mcq/routes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Dashboard | Quiz Maker",
	description: "Quiz Maker dashboard",
};

export default async function DashboardPage() {
	const session = await getCurrentSession();
	const name = session?.user.name;
	const email = session?.user.email;

	return (
		<div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-10">
			<header className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-medium text-muted-foreground">Quiz Maker</p>
					<h1 className="text-2xl font-semibold tracking-tight">
						Welcome{name ? `, ${name}` : ""}
					</h1>
					{email ? <p className="mt-1 text-sm text-muted-foreground">{email}</p> : null}
				</div>
				<LogoutButton />
			</header>

			<div className="rounded-xl border bg-card p-6 ring-1 ring-foreground/10">
				<h2 className="text-lg font-medium">Get started</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					Create and manage multiple choice questions for your quizzes.
				</p>
				<Button className="mt-4" render={<Link href={MCQ_ROUTES.list} />}>
					Manage questions
				</Button>
			</div>
		</div>
	);
}
