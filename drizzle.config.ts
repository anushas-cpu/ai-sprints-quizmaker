import fs from "node:fs";
import path from "node:path";

import { defineConfig } from "drizzle-kit";

function getLocalD1DbPath() {
	const basePath = path.resolve(".wrangler");
	const dbFile = fs
		.readdirSync(basePath, { encoding: "utf-8", recursive: true })
		.find((file) => file.endsWith(".sqlite"));

	if (!dbFile) {
		throw new Error(`No .sqlite file found in ${basePath}. Run db:migrate:local first.`);
	}

	return path.resolve(basePath, dbFile);
}

export default defineConfig({
	dialect: "sqlite",
	schema: "./src/lib/db/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: getLocalD1DbPath(),
	},
});
