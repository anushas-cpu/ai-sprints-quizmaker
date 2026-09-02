import Link from "next/link";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type AuthLayoutProps = {
	title: string;
	description?: string;
	footer: React.ReactNode;
	children: React.ReactNode;
};

export function AuthLayout({ title, description, footer, children }: AuthLayoutProps) {
	const titleId = "auth-page-title";

	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:px-6">
			<div className="w-full max-w-md">
				<div className="mb-6 text-center">
					<Link href="/" className="text-lg font-semibold tracking-tight">
						Quiz Maker
					</Link>
				</div>

				<Card>
					<CardHeader>
						<CardTitle id={titleId}>{title}</CardTitle>
						{description ? <CardDescription>{description}</CardDescription> : null}
					</CardHeader>
					<CardContent aria-labelledby={titleId}>{children}</CardContent>
					<CardFooter className="justify-center text-sm text-muted-foreground">{footer}</CardFooter>
				</Card>
			</div>
		</main>
	);
}

export function formErrorId(field: string): string {
	return `${field}-error`;
}

export function fieldDescribedBy(field: string, hasError: boolean): string | undefined {
	return hasError ? formErrorId(field) : undefined;
}
