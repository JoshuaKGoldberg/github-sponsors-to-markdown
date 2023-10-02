import { graphql } from "@octokit/graphql";

import { Logger } from "./types.js";

type GraphQLResult = GraphQLUserResult | GraphQLViewerResult;

interface GraphQLUserResult {
	user: ResultFields;
}

interface GraphQLViewerResult {
	viewer: ResultFields;
}

interface ResultFields {
	sponsorshipsAsMaintainer: SponsorshipsAsMaintainer;
}

type NullableProperties<T> = {
	[P in keyof T]: T[P] | null;
};

interface SponsorshipsAsMaintainer {
	edges: {
		node: NullableProperties<SponsorshipNode>;
	}[];
}

export interface SponsorshipNode {
	isOneTimePayment: boolean;
	sponsorEntity: {
		login: string;
		name: string;
	};
	tier: {
		id: string;
		monthlyPriceInDollars: number;
	};
}

interface GetSponsorshipsAsMaintainerOptions {
	auth: string;
	logger: Logger | undefined;
	login: string | undefined;
}

export async function getSponsorshipsAsMaintainer({
	auth,
	logger,
	login,
}: GetSponsorshipsAsMaintainerOptions) {
	const graphqlWithAuth = graphql.defaults({
		headers: {
			authorization: `token ${auth}`,
		},
	});

	logger?.("Querying sponsorships for:", login);
	const fieldName = login ? `user(login: "${login}")` : `viewer`;
	const result = await graphqlWithAuth<GraphQLResult>(`
	    {
	        ${fieldName} {
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
	`);

	logger?.("GraphQL response:", JSON.stringify(result, null, 4));

	const { sponsorshipsAsMaintainer } =
		"user" in result ? result.user : result.viewer;

	const nodes = sponsorshipsAsMaintainer.edges.map((edge) => edge.node);

	if (!isFullResponse(nodes)) {
		throw new Error(
			"Sponsorship data seems to be missing. Do you have the right token permissions?",
		);
	}

	return nodes;
}

function isFullResponse(
	nodes: NullableProperties<SponsorshipNode>[],
): nodes is SponsorshipNode[] {
	return nodes.every((node) => !!node.tier);
}
