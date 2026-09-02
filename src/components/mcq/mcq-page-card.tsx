import type { ReactNode } from "react";

type McqPageCardProps = {
	children: ReactNode;
};

export function McqPageCard({ children }: McqPageCardProps) {
	return (
		<div className="rounded-xl border bg-card p-6 ring-1 ring-foreground/10">{children}</div>
	);
}
