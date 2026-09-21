import { beforeEach, describe, expect, it, vi } from "vitest";

import { githubSponsorsToMarkdown } from "./index.js";

const mockGetGitHubAuthToken = vi.fn();

vi.mock("get-github-auth-token", () => ({
	get getGitHubAuthToken() {
		return mockGetGitHubAuthToken;
	},
}));

const mockGetSponsorshipsAsMaintainer = vi.fn();

vi.mock("./getSponsorshipsAsMaintainer.js", () => ({
	get getSponsorshipsAsMaintainer() {
		return mockGetSponsorshipsAsMaintainer;
	},
}));

describe("githubSponsorsToMarkdown", () => {
	beforeEach(() => {
		mockGetSponsorshipsAsMaintainer.mockResolvedValue([]);
	});

	it("uses the provided auth token when an auth option is provided", async () => {
		const auth = "abc123";

		await githubSponsorsToMarkdown({ auth });

		expect(mockGetGitHubAuthToken).not.toHaveBeenCalled();
		expect(mockGetSponsorshipsAsMaintainer).toHaveBeenCalledWith(
			expect.objectContaining({ auth }),
		);
	});

	it("uses the token from get-github-auth-token when an auth option is not provided and retrieving one succeeds", async () => {
		const token = "def456";
		mockGetGitHubAuthToken.mockResolvedValueOnce({ succeeded: true, token });

		await githubSponsorsToMarkdown();

		expect(mockGetSponsorshipsAsMaintainer).toHaveBeenCalledWith(
			expect.objectContaining({ auth: token }),
		);
	});

	it("throws an error when an auth option is not provided and retrieving one fails", async () => {
		mockGetGitHubAuthToken.mockResolvedValueOnce({
			error: "Oh no!",
			succeeded: false,
		});

		await expect(githubSponsorsToMarkdown()).rejects.toThrow(
			"Please provide an auth token (process.env.GH_TOKEN or gh auth login).",
		);
		expect(mockGetSponsorshipsAsMaintainer).not.toHaveBeenCalled();
	});
});
