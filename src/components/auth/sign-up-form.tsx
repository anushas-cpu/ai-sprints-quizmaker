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
import { signUpAction, type AuthFormState } from "@/lib/auth/actions";

const initialState: AuthFormState = {};

function getFieldErrors(errors: AuthFormState["errors"], field: string) {
	const messages = errors?.[field];
	return messages?.map((message) => ({ message }));
}

export function SignUpForm() {
	const [state, formAction, isPending] = useActionState(signUpAction, initialState);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	return (
		<AuthLayout
			title="Create your account"
			description="Register to create and manage quizzes."
			footer={
				<p>
					Already have an account?{" "}
					<a href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
						Sign in
					</a>
				</p>
			}
		>
			<form action={formAction} noValidate aria-describedby={state.formError ? "sign-up-form-error" : undefined}>
				<FieldGroup>
					{state.formError ? (
						<div
							id="sign-up-form-error"
							role="alert"
							aria-live="polite"
							className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
						>
							{state.formError}
						</div>
					) : null}

					<Field data-invalid={Boolean(state.errors?.name)}>
						<FieldLabel htmlFor="name">Name</FieldLabel>
						<Input
							id="name"
							name="name"
							type="text"
							autoComplete="name"
							placeholder="Enter your name"
							required
							aria-invalid={Boolean(state.errors?.name)}
							aria-describedby={fieldDescribedBy("name", Boolean(state.errors?.name))}
						/>
						<FieldError id={formErrorId("name")} errors={getFieldErrors(state.errors, "name")} />
					</Field>

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
								autoComplete="new-password"
								placeholder="Create a password"
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

					<Field data-invalid={Boolean(state.errors?.confirmPassword)}>
						<FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
						<div className="relative">
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								autoComplete="new-password"
								placeholder="Confirm your password"
								required
								className="pr-10"
								aria-invalid={Boolean(state.errors?.confirmPassword)}
								aria-describedby={fieldDescribedBy(
									"confirmPassword",
									Boolean(state.errors?.confirmPassword),
								)}
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								className="absolute top-1/2 right-1 -translate-y-1/2"
								onClick={() => setShowConfirmPassword((current) => !current)}
								aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
							>
								{showConfirmPassword ? <EyeOff /> : <Eye />}
							</Button>
						</div>
						<FieldError
							id={formErrorId("confirmPassword")}
							errors={getFieldErrors(state.errors, "confirmPassword")}
						/>
					</Field>

					<Button type="submit" size="lg" className="min-h-11 w-full" disabled={isPending}>
						{isPending ? (
							<>
								<Loader2 className="animate-spin" />
								Creating account...
							</>
						) : (
							"Create Account"
						)}
					</Button>
				</FieldGroup>
			</form>
		</AuthLayout>
	);
}
