import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";

type DashboardShellProps = {
	title: string;
	description?: string;
	action?: React.ReactNode;
	children: React.ReactNode;
};

export function DashboardShell({
	title,
	description,
	action,
	children,
}: DashboardShellProps) {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10">
			<header className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<p className="text-sm font-medium text-muted-foreground">
						<Link href="/dashboard" className="hover:underline">
							Quiz Maker
						</Link>
					</p>
					<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
					{description ? (
						<p className="text-sm text-muted-foreground">{description}</p>
					) : null}
				</div>
				<div className="flex items-center gap-2">
					{action}
					<LogoutButton />
				</div>
			</header>
			{children}
		</div>
	);
}
