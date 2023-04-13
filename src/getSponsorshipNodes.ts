import { graphql } from "@octokit/graphql";

if (!process.env.GH_TOKEN) {
	throw new Error(`Please provide a process.env.GH_TOKEN.`);
}

const graphqlWithAuth = graphql.defaults({
	headers: {
		authorization: `token ${process.env.GH_TOKEN}`,
	},
});

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

interface SponsorshipsAsMaintainer {
	edges: {
		node: SponsorshipNode;
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

export async function getSponsorshipsAsMaintainer(fieldName: string) {
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

	const { sponsorshipsAsMaintainer } =
		"user" in result ? result.user : result.viewer;

	return sponsorshipsAsMaintainer.edges.map((edge) => edge.node);
}
