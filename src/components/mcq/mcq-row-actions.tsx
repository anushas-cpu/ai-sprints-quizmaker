"use client";

import Link from "next/link";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteMcqAction } from "@/lib/mcq/actions";
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
				<AlertDialog>
					<AlertDialogTrigger
						render={
							<DropdownMenuItem variant="destructive" closeOnClick={false}>
								<Trash2 />
								Delete
							</DropdownMenuItem>
						}
					/>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete this question?</AlertDialogTitle>
							<AlertDialogDescription>
								&quot;{mcqName}&quot; and all of its choices will be permanently removed.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<form action={deleteMcqAction.bind(null, mcqId)}>
								<AlertDialogAction type="submit" variant="destructive">
									Delete
								</AlertDialogAction>
							</form>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
