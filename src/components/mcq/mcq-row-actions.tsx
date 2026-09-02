"use client";

import Link from "next/link";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";

import { DeleteMcqDialog } from "@/components/mcq/delete-mcq-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MCQ_ROUTES } from "@/lib/mcq/routes";

type McqRowActionsProps = {
	mcqId: string;
	mcqName: string;
};

export function McqRowActions({ mcqId, mcqName }: McqRowActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${mcqName}`}>
						<EllipsisVertical />
					</Button>
				}
			/>
			<DropdownMenuContent align="end">
				<DropdownMenuItem render={<Link href={MCQ_ROUTES.edit(mcqId)} />}>
					<Pencil />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem render={<Link href={MCQ_ROUTES.preview(mcqId)} />}>
					<Eye />
					Preview
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DeleteMcqDialog
					mcqId={mcqId}
					mcqName={mcqName}
					trigger={
						<DropdownMenuItem variant="destructive" closeOnClick={false}>
							<Trash2 />
							Delete
						</DropdownMenuItem>
					}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
