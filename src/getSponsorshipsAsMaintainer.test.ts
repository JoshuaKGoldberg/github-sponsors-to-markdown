import { describe, expect, it, vi } from "vitest";

import { getSponsorshipsAsMaintainer } from "./getSponsorshipsAsMaintainer.js";

const mockGraphql = vi.fn();
const mockGraphqlDefaults = vi.fn().mockResolvedValue(mockGraphql);

vi.mock("@octokit/graphql", () => ({
	graphql: { defaults: () => mockGraphql },
}));

const auth = "abc123";
const logger = vi.fn();
const node = { id: "def456", tier: { id: "ghi789", monthlyPriceInDollars: 1 } };

describe("getSponsorshipsAsMaintainer", () => {
	it("queries under the login as a user when login is provided", async () => {
		const login = "test-login";
		mockGraphql.mockResolvedValue({
			user: { sponsorshipsAsMaintainer: { edges: [{ node }] } },
		});

		const result = await getSponsorshipsAsMaintainer({ auth, logger, login });

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

	it("queries under the view when login is not provided", async () => {
		mockGraphql.mockResolvedValue({
			viewer: { sponsorshipsAsMaintainer: { edges: [{ node }] } },
		});

		const result = await getSponsorshipsAsMaintainer({
			auth,
			logger,
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
});
