import { z } from "zod";

import { AUTH_MESSAGES } from "@/lib/auth/messages";

const nameSchema = z
	.string()
	.trim()
	.min(1, AUTH_MESSAGES.signUp.nameRequired)
	.min(2, AUTH_MESSAGES.signUp.nameTooShort)
	.max(100, AUTH_MESSAGES.signUp.nameTooLong)
	.regex(/^[\p{L}\s'-]+$/u, AUTH_MESSAGES.signUp.nameInvalid);

const emailSchema = z
	.string()
	.trim()
	.min(1, AUTH_MESSAGES.signUp.emailRequired)
	.email(AUTH_MESSAGES.signUp.emailInvalid)
	.max(254, AUTH_MESSAGES.signUp.emailInvalid);

const passwordSchema = z
	.string()
	.min(1, AUTH_MESSAGES.signUp.passwordRequired)
	.min(8, AUTH_MESSAGES.signUp.passwordTooShort)
	.max(128, AUTH_MESSAGES.signUp.passwordTooShort)
	.refine((value) => /[A-Z]/.test(value), AUTH_MESSAGES.signUp.passwordMissingUppercase)
	.refine((value) => /[a-z]/.test(value), AUTH_MESSAGES.signUp.passwordMissingLowercase)
	.refine((value) => /[0-9]/.test(value), AUTH_MESSAGES.signUp.passwordMissingNumber)
	.refine(
		(value) => /[!@#$%^&*()_+\-=[\]{}|;:'",.<>/?`~\\]/.test(value),
		AUTH_MESSAGES.signUp.passwordMissingSpecial,
	);

export const signUpSchema = z
	.object({
		name: nameSchema,
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string().min(1, AUTH_MESSAGES.signUp.confirmPasswordRequired),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: AUTH_MESSAGES.signUp.confirmPasswordMismatch,
		path: ["confirmPassword"],
	});

export const signInSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, AUTH_MESSAGES.signIn.emailRequired)
		.email(AUTH_MESSAGES.signIn.emailInvalid),
	password: z.string().min(1, AUTH_MESSAGES.signIn.passwordRequired),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

export type FieldErrors = Record<string, string[]>;

export function flattenZodErrors(error: z.ZodError): FieldErrors {
	return error.issues.reduce<FieldErrors>((accumulator, issue) => {
		const field = issue.path[0];
		if (typeof field !== "string") {
			return accumulator;
		}

		accumulator[field] ??= [];
		accumulator[field].push(issue.message);
		return accumulator;
	}, {});
}
