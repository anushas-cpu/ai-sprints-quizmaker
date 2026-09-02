export const AUTH_MESSAGES = {
	signUp: {
		nameRequired: "Name is required.",
		nameTooShort: "Name must be at least 2 characters.",
		nameTooLong: "Name must not exceed 100 characters.",
		nameInvalid: "Name contains invalid characters.",
		emailRequired: "Email address is required.",
		emailInvalid: "Please enter a valid email address.",
		emailExists: "An account with this email already exists. Please sign in.",
		passwordRequired: "Password is required.",
		passwordTooShort: "Password must be at least 8 characters.",
		passwordMissingUppercase: "Password must contain at least one uppercase letter.",
		passwordMissingLowercase: "Password must contain at least one lowercase letter.",
		passwordMissingNumber: "Password must contain at least one number.",
		passwordMissingSpecial: "Password must contain at least one special character.",
		confirmPasswordRequired: "Please confirm your password.",
		confirmPasswordMismatch: "Passwords do not match.",
	},
	signIn: {
		emailRequired: "Email address is required.",
		emailInvalid: "Please enter a valid email address.",
		passwordRequired: "Password is required.",
		invalidCredentials: "Invalid email or password. Please try again.",
		sessionExpired: "Your session has expired. Please sign in again.",
	},
	common: {
		serverError: "Something went wrong. Please try again later.",
		rateLimited: "Too many attempts. Please wait a minute and try again.",
	},
	success: {
		registration: "Account created successfully. Please sign in.",
		signedOut: "You have been signed out.",
	},
} as const;
