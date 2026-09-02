Date created: September 2, 2026
Date last modified: September 2, 2026

# Multiple Choice Questions (MCQ) CRUD - Technical PRD

## Overview/Problem

Quiz Maker users can sign in, but they cannot yet create or manage assessment content. Teachers and trainers need a way to build multiple choice questions with answer choices, preview them, and track attempts. Without this capability, the dashboard remains a stub and the product cannot deliver its core value.

---

## Hypothesis

We believe that providing authenticated CRUD for multiple choice questions—with preview and attempt recording—will let educators start building quiz content inside Quiz Maker and validate the data model for future full-quiz features.

---

## Scope

### In Scope

- Database tables for MCQ questions, choices, and attempts
- MCQ service layer for create, read, update, delete, and attempt recording
- API routes for MCQ CRUD and attempt submission
- Server Actions for create, update, and delete from forms
- Protected dashboard pages:
  - List page with shadcn table and row actions (edit, preview, delete)
  - Create/edit page with 2–6 choices and exactly one correct answer
  - Preview page that records attempts
- Vitest unit tests for the MCQ service layer
- Expanded dashboard stub linking to question management

### Out of Scope

- Full quiz assembly (grouping multiple questions into a quiz)
- Quiz-taking flows across multiple questions
- Analytics dashboards for attempt history
- Sharing questions between users
- Image or rich-media answer choices

### Cut

- Drag-and-drop choice reordering — sort order is implicit from form order for now
- Inline table editing — edit happens on a dedicated page
- Bulk import/export — deferred until quiz packaging exists

---

## Technical Requirements

### Database Schema

```sql
CREATE TABLE mcq_questions (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  question TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
  updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE mcq_choices (
  id TEXT PRIMARY KEY NOT NULL,
  mcq_id TEXT NOT NULL,
  text TEXT NOT NULL,
  is_correct INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL,
  FOREIGN KEY (mcq_id) REFERENCES mcq_questions(id) ON DELETE CASCADE
);

CREATE TABLE mcq_attempts (
  id TEXT PRIMARY KEY NOT NULL,
  mcq_id TEXT NOT NULL,
  choice_id TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
  FOREIGN KEY (mcq_id) REFERENCES mcq_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (choice_id) REFERENCES mcq_choices(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### API Endpoints

#### GET /api/mcqs
**Response:**
- Success (200): `{ mcqs: McqSummary[] }`
- Error (401): Unauthorized

#### POST /api/mcqs
**Request Body:**
```json
{
  "name": "Capital of France",
  "question": "What is the capital of France?",
  "choices": [
    { "text": "Paris", "isCorrect": true },
    { "text": "London", "isCorrect": false }
  ]
}
```
**Response:**
- Success (201): `{ mcq: McqWithChoices }`
- Error (400): Validation error
- Error (401): Unauthorized

#### GET /api/mcqs/[id]
**Response:**
- Success (200): `{ mcq: McqWithChoices }`
- Error (404): Not found
- Error (401): Unauthorized

#### PUT /api/mcqs/[id]
**Request Body:** Same as POST /api/mcqs  
**Response:**
- Success (200): `{ mcq: McqWithChoices }`
- Error (400/404/401)

#### DELETE /api/mcqs/[id]
**Response:**
- Success (200): `{ success: true }`
- Error (404/401)

#### POST /api/mcqs/[id]/attempts
**Request Body:**
```json
{ "choiceId": "choice-uuid" }
```
**Response:**
- Success (201): `{ attempt: McqAttempt }`
- Error (400): Invalid choice
- Error (401): Unauthorized

### User Interface Requirements

#### MCQ List (`/dashboard/mcqs`)
- Table columns: Name, Question, Actions
- Actions menu (vertical ellipsis): Edit, Preview, Delete
- Primary button: New question
- Empty state with create CTA

#### Create/Edit (`/dashboard/mcqs/new`, `/dashboard/mcqs/[id]/edit`)
- Fields: name (required), question (required)
- 2–6 choices with text inputs
- Radio control to mark exactly one correct choice
- Save and Cancel buttons

#### Preview (`/dashboard/mcqs/[id]/preview`)
- Display question and choices
- Submit answer and show correct/incorrect result
- Record attempt in database

---

## Implementation Phases

### Phase 1: Data Model and Service Layer - COMPLETED

**Objective**: Persist MCQs, choices, and attempts with tested service functions.

**Tasks**:
1. Add Drizzle schema and migration
2. Implement `src/lib/services/mcq.ts`
3. Add Vitest tests for service CRUD and attempts

**Deliverables**:
- `src/lib/db/mcq.schema.ts`
- `drizzle/0008_init_mcq_tables.sql`
- `src/lib/services/mcq.ts`
- `src/lib/services/mcq.test.ts`

### Phase 2: API and Server Actions - COMPLETED

**Objective**: Expose MCQ operations to the application layer.

**Tasks**:
1. Add Zod validation schemas
2. Create API route handlers
3. Add Server Actions for form mutations

**Deliverables**:
- `src/lib/mcq/validation.ts`
- `src/lib/mcq/form.ts`
- `src/lib/mcq/handlers.ts`
- `src/lib/mcq/actions.ts`
- `src/lib/mcq/index.ts`
- `src/app/api/mcqs/**`
- `src/lib/mcq/validation.test.ts`
- `src/lib/mcq/form.test.ts`
- `src/lib/mcq/handlers.test.ts`

### Phase 3: Frontend - COMPLETED

**Objective**: Deliver list, create/edit, and preview experiences.

**Tasks**:
1. Install shadcn dropdown, textarea, alert-dialog, radio-group
2. Build MCQ table, form, preview, empty state, and delete dialog components
3. Add protected dashboard routes with shared shell and not-found handling
4. Add component tests for key UI flows

**Deliverables**:
- `src/app/dashboard/mcqs/**`
- `src/components/mcq/**`
- `src/components/mcq/mcq-empty-state.test.tsx`
- `src/components/mcq/mcq-form.test.tsx`
- `src/components/mcq/mcq-preview.test.tsx`
- `src/lib/mcq/actions.test.ts`

---

## Technical Implementation Details

### Key Files
- `src/lib/db/mcq.schema.ts` — Drizzle table definitions and relations
- `src/lib/services/mcq.ts` — Domain service for MCQ CRUD and attempts
- `src/lib/mcq/handlers.ts` — Testable API handler logic with consistent error responses
- `src/lib/mcq/form.ts` — FormData parsing for Server Actions
- `src/lib/mcq/actions.ts` — Server Actions for form create/update/delete
- `src/app/api/mcqs/route.ts` — List and create API
- `src/app/api/mcqs/[id]/route.ts` — Read, update, delete API
- `src/app/api/mcqs/[id]/attempts/route.ts` — Attempt recording API
- `src/app/dashboard/mcqs/page.tsx` — MCQ list table
- `src/components/mcq/mcq-form.tsx` — Shared create/edit form

### Implementation Patterns
- Service layer owns all database access; routes and actions stay thin
- Questions are scoped to the authenticated user via `user_id`
- Choices are replaced wholesale on update for simplicity
- Preview submits attempts through the attempts API route

### Important Notes
- Apply migration locally with `npm run db:migrate:local`
- Run service tests with `npm run test`
- Verify Workers runtime behavior with `npm run preview` when possible

---

## Acceptance Criteria

- [x] Authenticated users can create an MCQ with 2–6 choices and one correct answer
- [x] Users can view a table of their MCQs with name and question
- [x] Row actions support edit, preview, and delete
- [x] Users can update an existing MCQ and replace its choices
- [x] Preview records an attempt with selected choice and correctness
- [x] MCQ service layer has automated tests
- [x] `npm run lint` and `npm run build` pass

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Question creation success rate | > 95% of valid submissions | Server logs / manual QA |
| Service test coverage for MCQ CRUD | All core paths tested | `npm run test` |
| Time to create first question | < 2 minutes | Manual walkthrough |

---

## Dependencies

### External Dependencies
- Cloudflare D1 — persistence
- shadcn/ui Base UI components — table, dropdown, dialog, radio group

### Internal Dependencies
- Authentication module — session and protected routes
- Drizzle ORM — typed queries
- Zod — validation

---

## Risks and Mitigation

### Technical Risks
- **Risk**: Choice replacement on update could lose historical attempt integrity if choice IDs change
- **Mitigation**: Attempts reference choice IDs; deleting choices cascades attempts. Acceptable for MVP single-question preview.

### User Experience Risks
- **Risk**: Users may forget to mark a correct choice
- **Mitigation**: Server-side validation requires exactly one correct choice

---

## Troubleshooting Guide

_No entries yet._

---

## Notes for AI Agents

When extending this feature:
1. Keep MCQ ownership checks on every read/write path
2. Add new columns via Drizzle schema + migration, not ad-hoc SQL
3. Prefer Server Actions for form flows; API routes for programmatic or client fetch use cases
4. Update phase status and acceptance criteria as work progresses

---

## Current Status

**Last Updated**: September 2, 2026  
**Current Phase**: Phase 3 - Frontend  
**Status**: COMPLETED  
**Next Steps**: Manual QA with `npm run preview`, then consider quiz packaging in a future sprint
