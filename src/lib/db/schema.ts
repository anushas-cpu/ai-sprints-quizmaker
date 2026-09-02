import * as authSchema from "./auth.schema";
import * as mcqSchema from "./mcq.schema";

export const schema = {
	...authSchema,
	...mcqSchema,
} as const;

export * from "./auth.schema";
export * from "./mcq.schema";
