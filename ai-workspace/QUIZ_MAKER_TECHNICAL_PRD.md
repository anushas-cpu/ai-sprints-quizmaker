Date created: August 24, 2026
Date last modified: August 24, 2026

# Quiz Maker — Technical PRD (Sprint 0: Authentication)

## Project Overview

Quiz Maker is a web application that will allow users to create quizzes, manage quizzes, attempt quizzes, and view their results. The long-term product serves educators, trainers, and learners who need a simple way to build and take assessments online.

This document is the **Sprint 0** Technical Product Requirements Document. Sprint 0 is a design-only sprint: no application code is written during this phase. The purpose of this document is to define the authentication module in enough detail that developers and AI agents can implement it consistently in future sprints.

**Current application context:** The project is built on Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, and is deployed to Cloudflare Workers via OpenNext. No authentication, database, or user management exists yet.

---

## Business Goal

Establish a secure, reliable identity layer for Quiz Maker so that every future feature — quiz creation, quiz management, quiz attempts, and results — operates within the context of an authenticated user.

Without authentication, the application cannot associate quizzes, attempts, or reports with individual users. Sprint 0 ensures that the foundational user identity and access-control model is designed before any quiz-related features are built.

**Expected business outcomes from this sprint:**

- Users can create an account and sign in with confidence that their identity is protected.
- Only authenticated users can access application features intended for logged-in users.
- The team has a single, authoritative reference document for all authentication-related implementation work.

---

## Sprint Goal

Design the complete authentication feature before development begins.

Implementation begins in Sprint 1.

### In Scope for Sprint 1 (Design)

- User Sign Up
- User Sign In
- Logout
- User Session Management
- Protected Routes
- Basic authentication flow (end-to-end user journey from registration through logout)

### Out of Scope for Sprint 1 (Design and Implementation)

- Quiz creation
- Quiz management
- Quiz attempts
- Reports and analytics
- Password reset / forgot password
- Email verification
- Social login (Google, GitHub, etc.)
- Multi-factor authentication (MFA)
- Role-based access control (admin vs. user)
- User profile management beyond what is captured at sign-up

---

## Hypothesis

We believe that providing a straightforward email-and-password authentication flow with session management and protected routes will give Quiz Maker users a secure entry point and enable all future quiz-related features to be built on a stable identity foundation.

---

## User Flow

### New User (First Visit)

1. User lands on the application.
2. User navigates to the Sign Up page.
3. User enters Name, Email Address, Password, and Confirm Password.
4. System validates all fields client-side and server-side.
5. If validation passes and the email is unique, the account is created.
6. User sees a success confirmation and is redirected to the Sign In page.
7. User enters Email and Password on the Sign In page.
8. System validates credentials.
9. On success, a session is created and the user is redirected to the Dashboard.
10. User can access protected pages while the session is active.
11. User clicks Logout; session is cleared and user is redirected to Sign In.

### Returning User (Authenticated)

1. User visits the application with an active session.
2. User is recognized as authenticated and can access protected routes directly.
3. User navigates the application until they choose to log out.

### Returning User (Unauthenticated / Session Expired)

1. User visits the application without a valid session.
2. User attempts to access a protected route.
3. System redirects the user to the Sign In page.
4. User signs in and is redirected to the originally requested page or the Dashboard.

### Invalid Login Attempt

1. User enters incorrect email or password on the Sign In page.
2. System displays a meaningful, non-revealing error message.
3. User remains on the Sign In page and may retry.

---

## User Stories

### Sign Up

| ID | Story | Priority |
|----|-------|----------|
| US-01 | As a new user, I want to register with my name, email, and password so that I can create a Quiz Maker account. | Must Have |
| US-02 | As a new user, I want to see clear validation errors when I enter invalid or incomplete information so that I can correct my input. | Must Have |
| US-03 | As a new user, I want to be notified if my email is already registered so that I know to sign in instead. | Must Have |
| US-04 | As a new user, I want to be redirected to the Sign In page after successful registration so that I can log in to my new account. | Must Have |

### Sign In

| ID | Story | Priority |
|----|-------|----------|
| US-05 | As a registered user, I want to sign in with my email and password so that I can access the application. | Must Have |
| US-06 | As a registered user, I want to see a meaningful error when my credentials are invalid so that I understand why login failed. | Must Have |
| US-07 | As a registered user, I want to remain signed in across page navigation so that I do not have to log in repeatedly. | Must Have |
| US-08 | As a registered user, I want to be redirected to the Dashboard after successful login so that I can start using the application. | Must Have |

### Logout

| ID | Story | Priority |
|----|-------|----------|
| US-09 | As a signed-in user, I want to log out so that my session is ended on shared or public devices. | Must Have |
| US-10 | As a signed-in user, I want to be redirected to the Sign In page after logout so that I know I am no longer authenticated. | Must Have |

### Session Management and Protected Routes

| ID | Story | Priority |
|----|-------|----------|
| US-11 | As a signed-in user, I want to access protected pages without being asked to log in again while my session is valid. | Must Have |
| US-12 | As an unauthenticated user, I want to be redirected to Sign In when I try to access protected pages so that unauthorized access is prevented. | Must Have |
| US-13 | As an unauthenticated user, I want to return to my intended destination after signing in so that my workflow is not interrupted. | Should Have |

---

## Functional Requirements

### FR-01: User Registration (Sign Up)

- The system shall provide a Sign Up page accessible to unauthenticated users.
- The system shall collect: Name, Email Address, Password, and Confirm Password.
- All fields are required.
- Email must be validated for correct format.
- Email must be unique across all registered users.
- Password must meet complexity requirements (see Field Validation Rules).
- Confirm Password must exactly match Password.
- On successful registration, the system shall create a user account and redirect the user to the Sign In page with an optional success message.
- On validation failure, the system shall display field-level and/or form-level error messages without creating an account.

### FR-02: User Authentication (Sign In)

- The system shall provide a Sign In page accessible to unauthenticated users.
- The system shall collect: Email and Password.
- Both fields are required.
- The system shall validate credentials against stored user records.
- On successful authentication, the system shall create a user session and redirect to the Dashboard.
- On failed authentication, the system shall display a meaningful error message without revealing whether the email or password was incorrect.
- The Sign In page shall include a link to the Sign Up page for users who do not have an account.

### FR-03: Logout

- The system shall provide a Logout action available to authenticated users (e.g., from the Dashboard or a navigation header).
- On logout, the system shall invalidate/clear the user session completely.
- After logout, the system shall redirect the user to the Sign In page.

### FR-04: Session Management

- The system shall maintain an authenticated session after successful Sign In until the user logs out or the session expires.
- The session shall persist across page navigation within the application.
- The session shall persist across browser tab refreshes within the session lifetime.
- Session expiration behavior shall be defined during implementation; expired sessions shall require re-authentication.

### FR-05: Protected Routes

- The system shall define a set of routes that require authentication (e.g., Dashboard and all future quiz-related pages).
- Unauthenticated users attempting to access protected routes shall be redirected to the Sign In page.
- Authenticated users attempting to access Sign Up or Sign In pages may be redirected to the Dashboard (recommended to avoid confusion).

### FR-06: Dashboard (Placeholder)

- The system shall provide a minimal Dashboard page as the post-login landing page.
- The Dashboard confirms successful authentication and serves as the entry point for future quiz features.
- Dashboard content beyond a welcome/placeholder message is out of scope for this sprint.

---

## Non-Functional Requirements

### Security

- Passwords must never be stored in plain text; they must be hashed using an industry-standard algorithm with appropriate salting.
- Authentication tokens or session identifiers must be stored securely (HTTP-only cookies preferred over localStorage for session tokens).
- All authentication-related communication must occur over HTTPS in production.
- Failed login attempts must not reveal whether an email exists in the system.
- Input must be sanitized to prevent injection attacks.
- CSRF protection must be considered for state-changing authentication operations.
- Rate limiting on Sign In and Sign Up endpoints should be implemented to mitigate brute-force and account-enumeration attacks.

### Performance

- Sign In and Sign Up form submissions should provide user feedback (loading state) within 100 ms of submission.
- Authentication operations (sign in, sign up, session validation) should complete within 2 seconds under normal network conditions.
- Session validation on protected route access should not cause noticeable page load delays.

### Scalability

- The authentication design should support growth in user count without architectural changes in early phases.
- Session management approach should be compatible with Cloudflare Workers serverless deployment.
- User identity storage should be chosen to scale with the application (decision deferred to implementation sprint).

### Accessibility

- All form fields must have associated labels.
- Error messages must be announced to screen readers (e.g., via ARIA live regions or field descriptions).
- Form fields must be keyboard-navigable in logical tab order.
- Color must not be the sole indicator of error states; text and icons should accompany visual cues.
- Focus management should move to the first error field or error summary after failed submission.

### Responsive Design

- Sign Up, Sign In, and Dashboard pages must be usable on mobile (320px+), tablet, and desktop viewports.
- Form layouts should adapt gracefully without horizontal scrolling on small screens.
- Touch targets on mobile should meet a minimum size of 44×44 pixels.

### Maintainability

- Authentication logic should be centralized and reusable across routes and server actions.
- Validation rules should be defined in one place and shared between client and server where possible to avoid drift.
- Error messages should be defined as constants or a message catalog for consistency and future localization.

### Clean Architecture

- Separate concerns: presentation (pages/forms), application logic (authentication service), and data access (user persistence).
- Authentication should not be tightly coupled to quiz domain logic.
- Protected route enforcement should be implemented at a middleware or layout level rather than duplicated in every page.

---

## UI Requirements

### General Design Principles

- Use the existing design system: Tailwind CSS v4 and shadcn/ui (base-nova style).
- Authentication pages should be clean, focused, and free of distracting navigation.
- Maintain visual consistency between Sign Up and Sign In pages (shared layout, typography, spacing).
- Show loading indicators during form submission to prevent double-submission.

---

### Sign Up Page

**Route:** `/sign-up` (recommended; exact route to be confirmed during implementation)

**Page Title:** Create Account / Sign Up

**Page Elements:**

- Application logo or product name
- Page heading (e.g., "Create your account")
- Sign Up form
- Link to Sign In page (e.g., "Already have an account? Sign in")
- Optional brief subtitle describing the purpose of registration

**Form Layout:**

- Single-column form centered on the page for desktop and full-width on mobile.
- Submit button labeled "Sign Up" or "Create Account".
- All fields stacked vertically with consistent spacing.

---

### Sign In Page

**Route:** `/sign-in` (recommended; exact route to be confirmed during implementation)

**Page Elements:**

- Application logo or product name
- Page heading (e.g., "Sign in to Quiz Maker")
- Sign In form
- Link to Sign Up page (e.g., "Don't have an account? Sign up")
- Area to display post-registration success message when redirected from Sign Up

**Form Layout:**

- Single-column form centered on the page for desktop and full-width on mobile.
- Submit button labeled "Sign In" or "Log In".
- All fields stacked vertically with consistent spacing.

---

### Dashboard Page (Placeholder)

**Route:** `/dashboard` (protected)

**Page Elements:**

- Welcome message displaying `users.name` and `users.email`
- Logout button or link
- Placeholder content indicating future quiz features
- Minimal navigation shell if needed for logout access

---

## Data Model

User identity is persisted in Cloudflare D1 with Drizzle ORM. The `users` table contains **only** the required columns below. Passwords are hashed before storage (PBKDF2-SHA256 via Web Crypto).

### `users` Table

| Column | Type | Required | Populated by | UI exposure |
|--------|------|----------|--------------|-------------|
| `id` | text (PK) | Yes | System (generated UUID) | Never shown |
| `name` | text | Yes | Sign Up form `name` field | Dashboard welcome heading |
| `email` | text (unique) | Yes | Sign Up / Sign In `email` field | Dashboard subtitle |
| `password_hash` | text | Yes | Sign Up `password` field (hashed as `passwordHash`) | Never shown |

The following columns are **not** part of the `users` table: `email_verified`, `image`, `created_at`, `updated_at`, `firstName`, `lastName`, `username`, `password`.

### `sessions` Table

Sessions are stored separately for authenticated access:

| Column | Purpose |
|--------|---------|
| `id` | Session record ID |
| `token` | Opaque token stored in the session cookie |
| `user_id` | FK to `users.id` |
| `expires_at` | Session expiry timestamp |

### UI-to-column binding

| UI field (Sign Up) | Form `name` | Database destination |
|--------------------|-------------|----------------------|
| Name | `name` | `users.name` |
| Email Address | `email` | `users.email` |
| Password | `password` | `users.password_hash` (hashed) |
| Confirm Password | `confirmPassword` | Validation only — not persisted |

| UI field (Sign In) | Form `name` | Used for |
|--------------------|-------------|----------|
| Email | `email` | Lookup against `users.email` |
| Password | `password` | Verified against `users.password_hash` |

---

## Input Fields

### Sign Up Form

| Field | Type | Required | Placeholder (Suggested) | Notes |
|-------|------|----------|-------------------------|-------|
| Name | Text | Yes | "Enter your name" | Maps to `users.name`; accepts letters, spaces, hyphens, apostrophes |
| Email Address | Email | Yes | "Enter your email address" | Maps to `users.email`; must be unique |
| Password | Password | Yes | "Create a password" | Maps to `users.password_hash` (hashed); masked input with show/hide toggle |
| Confirm Password | Password | Yes | "Confirm your password" | Masked input; must match Password |

### Sign In Form

| Field | Type | Required | Placeholder (Suggested) | Notes |
|-------|------|----------|-------------------------|-------|
| Email | Email | Yes | "Enter your email address" | Maps to `users.email` |
| Password | Password | Yes | "Enter your password" | Verified against `users.password_hash`; masked input with show/hide toggle |

---

## Field Validation Rules

Validation must occur on both the client (immediate feedback) and the server (authoritative enforcement).

### Name (`users.name`)

| Rule | Requirement |
|------|-------------|
| Required | Must not be empty or whitespace-only |
| Minimum length | At least 2 characters |
| Maximum length | 100 characters |
| Allowed characters | Letters (including accented), spaces, hyphens, apostrophes |

### Email Address (`users.email`)

| Rule | Requirement |
|------|-------------|
| Required | Must not be empty |
| Format | Must match standard email format (e.g., `user@domain.com`) |
| Uniqueness | Must not already be registered (checked on server at sign-up) |
| Maximum length | 254 characters |

### Password (`users.password_hash`)

| Rule | Requirement |
|------|-------------|
| Required | Must not be empty |
| Minimum length | 8 characters |
| Uppercase | At least one uppercase letter (A–Z) |
| Lowercase | At least one lowercase letter (a–z) |
| Number | At least one digit (0–9) |
| Special character | At least one special character (e.g., `!@#$%^&*()_+-=[]{}|;:'",.<>?/`~`) |
| Maximum length | 128 characters (recommended upper bound) |

### Confirm Password

| Rule | Requirement |
|------|-------------|
| Required | Must not be empty |
| Match | Must exactly match the Password field |

### Sign In — Email

| Rule | Requirement |
|------|-------------|
| Required | Must not be empty |
| Format | Must match standard email format |

### Sign In — Password

| Rule | Requirement |
|------|-------------|
| Required | Must not be empty |

---

## Error Messages

Error messages must be clear, user-friendly, and consistent. Avoid technical jargon.

### Sign Up — Field-Level Errors

| Scenario | Error Message |
|----------|---------------|
| Name empty | "Name is required." |
| Name too short | "Name must be at least 2 characters." |
| Name too long | "Name must not exceed 100 characters." |
| Name invalid characters | "Name contains invalid characters." |
| Email empty | "Email address is required." |
| Email invalid format | "Please enter a valid email address." |
| Email already registered | "An account with this email already exists. Please sign in." |
| Password empty | "Password is required." |
| Password too short | "Password must be at least 8 characters." |
| Password missing uppercase | "Password must contain at least one uppercase letter." |
| Password missing lowercase | "Password must contain at least one lowercase letter." |
| Password missing number | "Password must contain at least one number." |
| Password missing special character | "Password must contain at least one special character." |
| Confirm Password empty | "Please confirm your password." |
| Confirm Password mismatch | "Passwords do not match." |

### Sign Up — Form-Level Errors

| Scenario | Error Message |
|----------|---------------|
| Server/network failure | "Something went wrong. Please try again later." |
| Multiple validation failures | Display all relevant field-level errors simultaneously |

### Sign In — Errors

| Scenario | Error Message |
|----------|---------------|
| Email empty | "Email address is required." |
| Email invalid format | "Please enter a valid email address." |
| Password empty | "Password is required." |
| Invalid credentials | "Invalid email or password. Please try again." |
| Server/network failure | "Something went wrong. Please try again later." |
| Session expired (if shown on redirect) | "Your session has expired. Please sign in again." |

**Security note:** The invalid credentials message must not indicate whether the email exists or the password was wrong.

---

## Success Messages

| Scenario | Message | Display Location |
|----------|---------|------------------|
| Successful registration | "Account created successfully. Please sign in." | Sign In page (banner or inline message after redirect) |
| Successful login | No explicit message required; redirect to Dashboard serves as confirmation | Dashboard |
| Successful logout | No explicit message required; redirect to Sign In serves as confirmation | Sign In page (optional: "You have been signed out.") |

---

## Navigation Flow

```
┌─────────────┐     Sign Up success      ┌─────────────┐
│  Sign Up    │ ───────────────────────► │  Sign In    │
│  /sign-up   │                          │  /sign-in   │
└─────────────┘                          └──────┬──────┘
       ▲                                        │
       │         "Already have an account?"     │ Sign In success
       │                                        ▼
       │         "Don't have an account?"  ┌─────────────┐
       └─────────────────────────────────── │  Dashboard  │
                                            │  /dashboard │
                                            └──────┬──────┘
                                                   │
                                              Logout
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │  Sign In    │
                                            │  /sign-in   │
                                            └─────────────┘

Protected route access (unauthenticated):
  Any protected route ──► Redirect to /sign-in
  (Optional) After sign-in ──► Redirect to originally requested route
```

### Navigation Rules

| From | Action | Destination |
|------|--------|-------------|
| Sign Up | Successful registration | Sign In |
| Sign Up | "Already have an account?" link | Sign In |
| Sign In | Successful login | Dashboard |
| Sign In | "Don't have an account?" link | Sign Up |
| Dashboard | Logout | Sign In |
| Protected route (unauthenticated) | Automatic redirect | Sign In |
| Sign In / Sign Up (authenticated) | Automatic redirect (recommended) | Dashboard |

---

## Authentication Flow

### Registration Flow

1. User submits Sign Up form.
2. Client validates all fields per Field Validation Rules.
3. If client validation fails, display field-level errors; stop.
4. If client validation passes, submit to server.
5. Server re-validates all fields (never trust client-only validation).
6. Server checks email uniqueness.
7. If email exists, return error: "An account with this email already exists."
8. If validation passes, hash password and persist user record.
9. Return success response.
10. Client redirects to Sign In with success message.

### Login Flow

1. User submits Sign In form.
2. Client validates required fields and email format.
3. If client validation fails, display field-level errors; stop.
4. If client validation passes, submit credentials to server.
5. Server looks up user by email.
6. If user not found or password does not match, return generic invalid credentials error.
7. If credentials valid, create session (secure cookie or token).
8. Return success response.
9. Client redirects to Dashboard (or originally requested protected route).

### Session Validation Flow

1. User requests a protected route or action.
2. Middleware or server-side check reads session from request.
3. If session is valid and not expired, allow access.
4. If session is missing or expired, redirect to Sign In.

### Logout Flow

1. User triggers Logout action.
2. Server invalidates/clears session.
3. Client clears any client-side session state.
4. Redirect to Sign In page.

---

## Security Requirements

| ID | Requirement |
|----|-------------|
| SEC-01 | Passwords must be hashed before storage; plain-text passwords must never be persisted or logged. |
| SEC-02 | Use a proven password hashing algorithm (e.g., bcrypt, Argon2, or scrypt). |
| SEC-03 | Session tokens must be cryptographically secure and unpredictable. |
| SEC-04 | Session cookies must be marked `HttpOnly` and `Secure` (in production). |
| SEC-05 | Session cookies should use `SameSite=Lax` or `Strict` to mitigate CSRF. |
| SEC-06 | Authentication error responses must not disclose whether an email is registered. |
| SEC-07 | Implement rate limiting on authentication endpoints to prevent brute-force attacks. |
| SEC-08 | All user input must be validated and sanitized on the server. |
| SEC-09 | Protect against CSRF on state-changing authentication requests. |
| SEC-10 | Do not expose sensitive data (passwords, session tokens, hashes) in URLs, logs, or error responses. |
| SEC-11 | Define and enforce session expiration and idle timeout policies during implementation. |
| SEC-12 | Authentication secrets (session signing keys, etc.) must be stored in environment variables, not in source code. |

---

## Acceptance Criteria

### Sign Up

- [x] User can access the Sign Up page without being authenticated.
- [x] User can register with Name, Email, Password, and Confirm Password.
- [x] All required field validations are enforced with correct error messages.
- [x] Invalid email format is rejected with the appropriate error message.
- [x] Duplicate email registration is rejected with the appropriate error message.
- [x] Password complexity rules are enforced (8+ chars, upper, lower, number, special).
- [x] Confirm Password mismatch is rejected with the appropriate error message.
- [x] Successful registration redirects the user to the Sign In page with a success message.
- [x] No account is created when validation fails.

### Sign In

- [x] User can access the Sign In page without being authenticated.
- [x] User can sign in with valid email and password.
- [x] Invalid credentials display "Invalid email or password. Please try again."
- [x] Empty fields display appropriate required-field errors.
- [x] Successful login creates a session and redirects to the Dashboard.
- [x] Sign In page includes a link to Sign Up.

### Logout

- [x] Authenticated user can log out from the Dashboard (or global navigation).
- [x] Logout clears the session completely.
- [x] After logout, user is redirected to the Sign In page.
- [x] After logout, protected routes are inaccessible without signing in again.

### Session Management

- [x] Session persists across page navigation within the application.
- [x] Session persists across browser refresh within session lifetime.
- [x] Expired or invalid sessions redirect the user to Sign In.

### Protected Routes

- [x] Unauthenticated access to protected routes redirects to Sign In.
- [x] Authenticated users can access the Dashboard and other protected routes.
- [x] Authenticated users visiting Sign In or Sign Up are redirected to Dashboard (recommended).

### Non-Functional

- [x] Authentication pages are responsive on mobile, tablet, and desktop.
- [x] Form fields are keyboard-accessible and have proper labels.
- [x] Error messages are accessible to screen readers.
- [x] Passwords are never stored or logged in plain text.
- [x] Authentication works correctly in the Cloudflare Workers runtime (`npm run preview`).

---

## Assumptions

| ID | Assumption |
|----|------------|
| A-01 | Users will authenticate using email and password only; no social login in this phase. |
| A-02 | One account per email address; emails are case-insensitive for uniqueness checks. |
| A-03 | The Dashboard is a minimal placeholder page sufficient to confirm authentication; quiz features come later. |
| A-04 | A persistent data store (e.g., Cloudflare D1 or similar) will be chosen and configured during the implementation sprint. |
| A-05 | An authentication library or session management approach compatible with Next.js App Router and Cloudflare Workers will be selected during implementation (e.g., Auth.js, Lucia, or custom JWT with secure cookies). |
| A-06 | Email verification is not required before first login in this phase. |
| A-07 | Password reset is not available in this phase; users who forget passwords have no self-service recovery. |
| A-08 | All users have equal access once authenticated; no roles or permissions in this phase. |
| A-09 | The application is accessed via modern browsers (Chrome, Firefox, Safari, Edge — last two major versions). |
| A-10 | HTTPS is enforced in production via Cloudflare. |

---

## Out of Scope

The following are explicitly excluded from Sprint 0 and the first authentication implementation sprint:

- Quiz creation, editing, deletion, or publishing
- Quiz categories, tags, or organization
- Quiz attempts and scoring
- Results, reports, and analytics
- Password reset / forgot password flow
- Email verification / confirmation emails
- Social or OAuth login (Google, GitHub, Microsoft, etc.)
- Multi-factor authentication (MFA / 2FA)
- Role-based access control (admin, teacher, student)
- User profile editing after registration
- Account deletion or deactivation
- "Remember me" extended session option
- Account lockout after repeated failed login attempts (may be added later)
- Audit logging of authentication events
- CAPTCHA or bot protection (may be added later)
- Internationalization (i18n) of authentication messages

---

## Future Enhancements

These items may be addressed in later sprints after core authentication is stable:

| Enhancement | Description |
|-------------|-------------|
| Password reset | Allow users to reset forgotten passwords via email link |
| Email verification | Require email confirmation before account activation |
| Social login | Sign in with Google, GitHub, or other OAuth providers |
| Multi-factor authentication | Add TOTP or SMS-based second factor |
| Role-based access | Distinguish quiz creators, administrators, and participants |
| User profile management | Edit name, email, password, and avatar |
| Session management UI | View and revoke active sessions across devices |
| Account lockout | Temporarily lock accounts after repeated failed login attempts |
| CAPTCHA / Turnstile | Protect Sign Up and Sign In from automated abuse |
| "Remember me" | Optional extended session duration |
| Authentication audit log | Track login, logout, and failed attempt events for security review |

---

## Risks and Open Questions

### Risks

| ID | Risk | Impact | Mitigation |
|----|------|--------|------------|
| R-01 | Cloudflare Workers runtime constraints may limit choice of authentication libraries | High | Evaluate library compatibility with Workers during Sprint 1 planning; test with `npm run preview` early |
| R-02 | Session management across serverless edge may behave differently than traditional servers | Medium | Prototype session storage (cookie-based vs. external store) early; document chosen approach |
| R-03 | Without password reset, users who forget passwords cannot recover accounts | Medium | Document as known limitation; prioritize password reset in a near-term future sprint |
| R-04 | Without email verification, users may register with invalid or mistyped emails | Low | Accept for MVP; add verification in a future sprint |
| R-05 | Brute-force attacks on Sign In without rate limiting | High | Implement rate limiting in the first implementation sprint |
| R-06 | Validation rule drift between client and server | Medium | Share validation schemas between client and server during implementation |

### Open Questions

| ID | Question | Owner | Status |
|----|----------|-------|--------|
| OQ-01 | Which authentication library or approach will be used (Auth.js, Lucia, custom)? | Engineering | Resolved — Custom D1 auth with hashed passwords and session cookies |
| OQ-02 | Which database/storage will persist user records (Cloudflare D1, KV, other)? | Engineering | Resolved — Cloudflare D1 (`quizmaker-db`, binding `DB`) |
| OQ-03 | What is the session expiration duration (e.g., 24 hours, 7 days)? | Product / Engineering | Open |
| OQ-04 | Should authenticated users be redirected away from Sign In / Sign Up pages? | Product | Open — recommended yes |
| OQ-05 | After login, should users be redirected to their originally requested URL or always to Dashboard? | Product | Open — recommended original URL with Dashboard fallback |
| OQ-06 | Should `users.name` and `users.email` be displayed on the Dashboard? | Product | Resolved — yes, both are shown |
| OQ-07 | Is case sensitivity required for email lookup (recommend case-insensitive)? | Engineering | Open |
| OQ-08 | Will Turnstile or another CAPTCHA be added at launch or post-MVP? | Product / Security | Open |

---

## Implementation Phases (Future Sprints)

Sprint 0 is design only. The following phases are planned for future sprints and are included for roadmap visibility. Status markers will be updated as work progresses.

### Phase 1: Foundation — COMPLETED

**Objective:** Set up user persistence, authentication library, and environment configuration.

**Tasks:**
1. Select and install authentication library and database/storage
2. Configure environment variables and secrets
3. Define user data model and migrations
4. Implement password hashing utility

**Deliverables:**
- Working local database with users table
- Authentication library integrated with Next.js App Router

### Phase 2: Sign Up and Sign In — COMPLETED

**Objective:** Implement registration and login flows end-to-end.

**Tasks:**
1. Build Sign Up page with validation and error handling
2. Build Sign In page with validation and error handling
3. Implement server-side authentication actions
4. Wire success/error messages and redirects

**Deliverables:**
- Functional Sign Up and Sign In pages
- Users can register and log in

### Phase 3: Session Management and Protected Routes — COMPLETED

**Objective:** Enforce authentication across the application.

**Tasks:**
1. Implement session creation, validation, and destruction
2. Add middleware or layout guards for protected routes
3. Build placeholder Dashboard page
4. Implement Logout action

**Deliverables:**
- Protected Dashboard accessible only to authenticated users
- Working logout flow
- Unauthenticated redirect behavior

### Phase 4: Hardening and Verification — COMPLETED

**Objective:** Meet security and non-functional requirements before considering authentication complete.

**Tasks:**
1. Add rate limiting to authentication endpoints
2. Verify accessibility and responsive behavior
3. Test on Cloudflare Workers runtime (`npm run preview`)
4. Run lint and production build; fix issues

**Deliverables:**
- Authentication module passes all acceptance criteria
- Documented session and security configuration (see `ai-workspace/AUTH_SECURITY_CONFIG.md`)

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Registration completion rate | > 90% of started sign-ups succeed on first attempt | Ratio of successful registrations to form submissions |
| Login success rate | > 95% of valid credential attempts succeed | Ratio of successful logins to valid-credential attempts |
| Authentication response time | < 2 seconds (p95) | Server-side timing on sign-in and sign-up |
| Protected route enforcement | 100% of unauthenticated requests redirected | Automated test or manual QA checklist |
| Accessibility | Zero critical WCAG 2.1 AA violations on auth pages | Accessibility audit (manual or automated) |

---

## Dependencies

### External Dependencies

- Cloudflare Workers / OpenNext — Application hosting runtime
- Cloudflare D1 or equivalent — User persistence (to be confirmed in Sprint 1)
- Authentication library — Session and credential management (to be confirmed in Sprint 1)

### Internal Dependencies

- Next.js App Router — Page routing and server actions
- shadcn/ui — Form components (Input, Button, Label, Alert)
- Tailwind CSS v4 — Styling
- Environment configuration — `.dev.vars` for local secrets, Wrangler secrets for production

### Environment Variables (Anticipated)

The following will be required during implementation (exact names to be confirmed):

- Session secret / signing key
- Database connection binding (if using D1)
- Application base URL (for redirects)

---

## Notes for AI Agents

When working with this PRD:

1. **Start with Problem and Scope.** This sprint covers authentication only. Do not build quiz features.
2. **Do not invent out-of-scope features.** Refer to the Out of Scope section before adding functionality.
3. **Follow validation rules exactly.** Error messages in this document are the canonical user-facing copy.
4. **Security requirements are mandatory.** Never store plain-text passwords; never reveal whether an email exists on failed login.
5. **Test on Workers runtime.** Use `npm run preview` for anything session- or cookie-related.
6. **Ask before adding dependencies.** Propose authentication libraries and databases with rationale.
7. **Update phase status markers** in Implementation Phases as work progresses.
8. **Mark acceptance criteria** as complete only when verified, not when code is merely written.
9. **Resolve open questions** in the Risks and Open Questions section before making irreversible architecture decisions.
10. **Do not modify this PRD** during implementation unless the user explicitly requests a scope change.

---

## Current Status

**Last Updated:** August 24, 2026
**Current Phase:** Authentication module complete (Phases 1–4)
**Status:** COMPLETED
**Next Steps:** Begin quiz feature development in a future sprint
