import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { McqRowActions } from "@/components/mcq/mcq-row-actions";
import type { McqSummary } from "@/lib/services/mcq";

type McqTableProps = {
	mcqs: McqSummary[];
};

export function McqTable({ mcqs }: McqTableProps) {
	return (
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
	);
}
