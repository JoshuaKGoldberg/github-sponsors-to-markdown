import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			all: true,
			exclude: ["lib"],
			include: ["src"],
			reporter: ["html", "lcov"],

			// c8 reports types-only lines as uncovered
			// https://github.com/JoshuaKGoldberg/github-sponsors-to-markdown/issues/100
			provider: "istanbul",
		},
	},
});
