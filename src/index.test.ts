import { describe, expect, it } from "vitest";

import { githubSponsorsToMarkdown } from "./index.js";

describe("githubSponsorsToMarkdown", () => {
	it("exists", () => {
		expect(githubSponsorsToMarkdown).toBeDefined();
	});
});
