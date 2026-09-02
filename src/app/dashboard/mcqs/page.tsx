import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { DashboardShell } from "@/components/mcq/dashboard-shell";
import { McqRowActions } from "@/components/mcq/mcq-row-actions";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { requireAuth } from "@/lib/auth/session";
import { MCQ_MESSAGES } from "@/lib/mcq/messages";
import { MCQ_ROUTES } from "@/lib/mcq/routes";
import { listMcqsByUser } from "@/lib/services/mcq";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Multiple Choice Questions | Quiz Maker",
	description: "Manage multiple choice questions",
};

export default async function McqListPage() {
	const session = await requireAuth(MCQ_ROUTES.list);
	const mcqs = await listMcqsByUser(session.user.id);

	return (
		<DashboardShell
			title="Multiple choice questions"
			description="Create, edit, preview, and delete your questions."
			action={
				<Button render={<Link href={MCQ_ROUTES.new} />}>
					<Plus />
					New question
				</Button>
			}
		>
			<div className="rounded-xl border bg-card ring-1 ring-foreground/10">
				{mcqs.length === 0 ? (
					<div className="p-8 text-center text-sm text-muted-foreground">
						<p>{MCQ_MESSAGES.list.empty}</p>
						<Button className="mt-4" render={<Link href={MCQ_ROUTES.new} />}>
							<Plus />
							Create question
						</Button>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Question</TableHead>
								<TableHead className="w-[80px] text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mcqs.map((mcq) => (
								<TableRow key={mcq.id}>
									<TableCell className="font-medium">{mcq.name}</TableCell>
									<TableCell className="max-w-md truncate text-muted-foreground">
										{mcq.question}
									</TableCell>
									<TableCell className="text-right">
										<McqRowActions mcqId={mcq.id} mcqName={mcq.name} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</DashboardShell>
	);
}
