import { drizzle } from "drizzle-orm/d1";

import { getCloudflareEnv } from "@/lib/cloudflare/env";
import { schema } from "./schema";

type AppDb = ReturnType<typeof drizzle<typeof schema>>;

let devDb: AppDb | undefined;

export async function getDb() {
	if (process.env.NODE_ENV === "development" && devDb) {
		return devDb;
	}

	const env = await getCloudflareEnv();
	const db = drizzle(env.DB, {
		schema,
	});

	if (process.env.NODE_ENV === "development") {
		devDb = db;
	}

	return db;
}

export * from "drizzle-orm";
export * from "./schema";
