import { graphql } from "@octokit/graphql";
import {
	defaultOptions,
	GithubSponsorsToMarkdownOptions,
	SponsorshipTier,
} from "./options.js";

if (!process.env.GH_TOKEN) {
	throw new Error(`Please provide a process.env.GH_TOKEN.`);
}

const graphqlWithAuth = graphql.defaults({
	headers: {
		authorization: `token ${process.env.GH_TOKEN}`,
	},
});

interface ViewerResult {
	sponsorshipsAsMaintainer: {
		edges: {
			node: SponsorshipNode;
		}[];
	};
}

interface SponsorshipNode {
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

export async function githubSponsorsToMarkdown({
	tiers = defaultOptions.tiers,
}: GithubSponsorsToMarkdownOptions) {
	const { viewer } = await graphqlWithAuth<{ viewer: ViewerResult }>(`
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
	`);

	const sponsorshipsSorted = viewer.sponsorshipsAsMaintainer.edges
		.map((edge) => edge.node)
		.filter((node) => !node.isOneTimePayment)
		.sort((a, b) => b.sponsorEntity.login.localeCompare(a.sponsorEntity.login));

	const tierGroups = groupSponsorships(sponsorshipsSorted, tiers);
	const width = `${Math.floor(100 / Object.keys(tierGroups).length)}%`;

	const tierGroupsSorted = Object.fromEntries(
		Object.entries(tierGroups).sort(
			([a], [b]) => tiers[b].minimum - tiers[a].minimum
		)
	);

	return [
		`<table width="100%">`,
		`\t<thead>`,
		`\t\t<tr>`,
		...Object.keys(tierGroupsSorted).map(
			(tier) =>
				`\t\t\t<th width="${width}">${
					tiers[tier].label ?? `${tier} Sponsors`
				}</th>`
		),
		`\t\t</tr>`,
		`\t</thead>`,
		`\t<tbody>`,
		`\t\t<tr align="center">`,
		...Object.values(tierGroupsSorted).map((descriptions) =>
			[
				`\t\t\t<td >`,
				...descriptions.map(createLinkForSponsorship),
				`\t\t\t</td>`,
			].join("\n")
		),
		`\t\t</tr>`,
		`\t</tbody>`,
		`</table>`,
	].join("\n");
}

function createLinkForSponsorship({
	sponsorship,
	tier,
}: SponsorshipDescription) {
	const { login, name } = sponsorship.sponsorEntity;
	const url = `https://github.com/${login}`;

	return [
		`\t\t\t\t<a href="${url}">`,
		`\t\t\t\t\t<img alt="${name}" src="${url}.png?size=${tier.size}" />`,
		`\t\t\t\t</a>`,
	].join("\n");
}

interface SponsorshipDescription {
	sponsorship: SponsorshipNode;
	tier: SponsorshipTier;
}

function groupSponsorships(
	sponsorships: SponsorshipNode[],
	tiers: Record<string, SponsorshipTier>
) {
	const tierGroups: Record<string, SponsorshipDescription[]> = {};
	const tierEntries = Object.entries(tiers);

	for (const sponsorship of sponsorships) {
		for (const [tierName, tier] of tierEntries) {
			if (sponsorship.tier.monthlyPriceInDollars >= tier.minimum) {
				(tierGroups[tierName] ??= []).push({ sponsorship, tier });
				break;
			}
		}
	}

	return tierGroups;
}
