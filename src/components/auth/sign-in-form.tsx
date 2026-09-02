"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { AuthLayout, fieldDescribedBy, formErrorId } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInAction, type AuthFormState } from "@/lib/auth/actions";
import { AUTH_MESSAGES } from "@/lib/auth/messages";

const initialState: AuthFormState = {};

function getFieldErrors(errors: AuthFormState["errors"], field: string) {
	const messages = errors?.[field];
	return messages?.map((message) => ({ message }));
}

type SignInFormProps = {
	callbackUrl?: string;
	showRegistrationSuccess?: boolean;
	showSessionExpired?: boolean;
	showSignedOut?: boolean;
};

export function SignInForm({
	callbackUrl = "/dashboard",
	showRegistrationSuccess = false,
	showSessionExpired = false,
	showSignedOut = false,
}: SignInFormProps) {
	const [state, formAction, isPending] = useActionState(signInAction, initialState);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<AuthLayout
			title="Sign in to Quiz Maker"
			footer={
				<p>
					Don&apos;t have an account?{" "}
					<a href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
						Sign up
					</a>
				</p>
			}
		>
			<form action={formAction} noValidate aria-describedby={state.formError ? "sign-in-form-error" : undefined}>
				<input type="hidden" name="callbackUrl" value={callbackUrl} />
				<FieldGroup>
					{showRegistrationSuccess ? (
						<div
							role="status"
							aria-live="polite"
							className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground"
						>
							{AUTH_MESSAGES.success.registration}
						</div>
					) : null}

					{showSessionExpired ? (
						<div
							role="alert"
							aria-live="polite"
							className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
						>
							{AUTH_MESSAGES.signIn.sessionExpired}
						</div>
					) : null}

					{showSignedOut ? (
						<div
							role="status"
							aria-live="polite"
							className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground"
						>
							{AUTH_MESSAGES.success.signedOut}
						</div>
					) : null}

					{state.formError ? (
						<div
							id="sign-in-form-error"
							role="alert"
							aria-live="polite"
							className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
						>
							{state.formError}
						</div>
					) : null}

					<Field data-invalid={Boolean(state.errors?.email)}>
						<FieldLabel htmlFor="email">Email Address</FieldLabel>
						<Input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							placeholder="Enter your email address"
							required
							aria-invalid={Boolean(state.errors?.email)}
							aria-describedby={fieldDescribedBy("email", Boolean(state.errors?.email))}
						/>
						<FieldError id={formErrorId("email")} errors={getFieldErrors(state.errors, "email")} />
					</Field>

					<Field data-invalid={Boolean(state.errors?.password)}>
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<div className="relative">
							<Input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								placeholder="Enter your password"
								required
								className="pr-10"
								aria-invalid={Boolean(state.errors?.password)}
								aria-describedby={fieldDescribedBy("password", Boolean(state.errors?.password))}
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								className="absolute top-1/2 right-1 -translate-y-1/2"
								onClick={() => setShowPassword((current) => !current)}
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? <EyeOff /> : <Eye />}
							</Button>
						</div>
						<FieldError id={formErrorId("password")} errors={getFieldErrors(state.errors, "password")} />
					</Field>

					<Button type="submit" size="lg" className="min-h-11 w-full" disabled={isPending}>
						{isPending ? (
							<>
								<Loader2 className="animate-spin" />
								Signing in...
							</>
						) : (
							"Sign In"
						)}
					</Button>
				</FieldGroup>
			</form>
		</AuthLayout>
	);
}
