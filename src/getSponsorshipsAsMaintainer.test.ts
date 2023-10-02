import { describe, expect, it, vi } from "vitest";

import { getSponsorshipsAsMaintainer } from "./getSponsorshipsAsMaintainer.js";

const mockGraphql = vi.fn();

vi.mock("@octokit/graphql", () => ({
	graphql: { defaults: () => mockGraphql },
}));

const auth = "abc123";
const node = { id: "def456", tier: { id: "ghi789", monthlyPriceInDollars: 1 } };

describe("getSponsorshipsAsMaintainer", () => {
	it("queries under the login as a user when login is provided", async () => {
		const login = "test-login";
		mockGraphql.mockResolvedValue({
			user: { sponsorshipsAsMaintainer: { edges: [{ node }] } },
		});

		const result = await getSponsorshipsAsMaintainer({
			auth,
			logger: undefined,
			login,
		});

		expect(mockGraphql.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "
				    {
				        user(login: \\"test-login\\") {
				            sponsorshipsAsMaintainer(activeOnly: true, first: 100) {
			                    edges {
			                        node {
			                            sponsorEntity {
			                                ... on Organization {
			                                    login
			                                    name
			                                }
			                                ... on User {
			                                    login
			                                    name
			                                }
			                            }
			                            isOneTimePayment
			                            tier {
			                                id
			                                monthlyPriceInDollars
			                            }
			                        }
			                    }
			                }
			            }
			        }
				",
			  ],
			]
		`);

		expect(result).toEqual([node]);
	});

	it("queries under the view when login is not provided", async () => {
		mockGraphql.mockResolvedValue({
			viewer: { sponsorshipsAsMaintainer: { edges: [{ node }] } },
		});

		const result = await getSponsorshipsAsMaintainer({
			auth,
			logger: undefined,
			login: undefined,
		});

		expect(mockGraphql.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "
				    {
				        viewer {
				            sponsorshipsAsMaintainer(activeOnly: true, first: 100) {
			                    edges {
			                        node {
			                            sponsorEntity {
			                                ... on Organization {
			                                    login
			                                    name
			                                }
			                                ... on User {
			                                    login
			                                    name
			                                }
			                            }
			                            isOneTimePayment
			                            tier {
			                                id
			                                monthlyPriceInDollars
			                            }
			                        }
			                    }
			                }
			            }
			        }
				",
			  ],
			]
		`);

		expect(result).toEqual([node]);
	});

	it("logs to the logger when one is provided", async () => {
		const logger = vi.fn();

		mockGraphql.mockResolvedValue({
			viewer: { sponsorshipsAsMaintainer: { edges: [{ node }] } },
		});

		await getSponsorshipsAsMaintainer({
			auth,
			logger,
			login: "test-login",
		});

		expect(logger.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Querying sponsorships for:",
			    "test-login",
			  ],
			  [
			    "GraphQL response:",
			    "{
			    \\"viewer\\": {
			        \\"sponsorshipsAsMaintainer\\": {
			            \\"edges\\": [
			                {
			                    \\"node\\": {
			                        \\"id\\": \\"def456\\",
			                        \\"tier\\": {
			                            \\"id\\": \\"ghi789\\",
			                            \\"monthlyPriceInDollars\\": 1
			                        }
			                    }
			                }
			            ]
			        }
			    }
			}",
			  ],
			]
		`);
	});

	it("throws an error if sponsorship data is missing information", async () => {
		mockGraphql.mockResolvedValue({
			viewer: { sponsorshipsAsMaintainer: { edges: [{ node: {} }] } },
		});

		await expect(
			async () =>
				await getSponsorshipsAsMaintainer({
					auth,
					logger: undefined,
					login: undefined,
				}),
		).rejects.toMatchInlineSnapshot(
			"[Error: Sponsorship data seems to be missing. Do you have the right token permissions?]",
		);
	});
});
