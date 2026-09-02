export const MCQ_ROUTES = {
	list: "/dashboard/mcqs",
	new: "/dashboard/mcqs/new",
	edit: (id: string) => `/dashboard/mcqs/${id}/edit`,
	preview: (id: string) => `/dashboard/mcqs/${id}/preview`,
} as const;

export const MCQ_API_ROUTES = {
	list: "/api/mcqs",
	byId: (id: string) => `/api/mcqs/${id}`,
	attempts: (id: string) => `/api/mcqs/${id}/attempts`,
} as const;
