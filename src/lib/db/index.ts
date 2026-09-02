import { drizzle } from "drizzle-orm/d1";

import { getCloudflareEnv } from "@/lib/cloudflare/env";
import { schema } from "./schema";

export async function getDb() {
	const env = await getCloudflareEnv();

	return drizzle(env.DB, {
		schema,
	});
}

export * from "drizzle-orm";
export * from "./schema";
