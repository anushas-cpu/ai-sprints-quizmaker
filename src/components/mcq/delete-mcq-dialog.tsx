"use client";

import { useFormStatus } from "react-dom";

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
import { deleteMcqAction } from "@/lib/mcq/actions";

type DeleteMcqDialogProps = {
	mcqId: string;
	mcqName: string;
	trigger: React.ReactElement;
};

function DeleteSubmitButton() {
	const { pending } = useFormStatus();

	return (
		<AlertDialogAction type="submit" variant="destructive" disabled={pending}>
			{pending ? "Deleting..." : "Delete"}
		</AlertDialogAction>
	);
}

export function DeleteMcqDialog({ mcqId, mcqName, trigger }: DeleteMcqDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger render={trigger} nativeButton={false} />
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
						<DeleteSubmitButton />
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
