import { graphql } from "@octokit/graphql";

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

export async function githubSponsorsToMarkdown() {
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

	const tiers = groupByTier(sponsorshipsSorted);

	return [
		`<table width="100%">`,
		`\t<thead>`,
		`\t\t<tr>`,
		...Object.keys(tiers).map(
			(tier) => `\t\t\t<th width="33%">${tier} Sponsors</th>`
		),
		`\t\t</tr>`,
		`\t</thead>`,
		`\t<tbody>`,
		`\t\t<tr align="center">`,
		...Object.values(tiers).map((sponsorships) =>
			[
				`\t\t\t<td >`,
				...sponsorships.map(createLinkForSponsorship),
				`\t\t\t</td>`,
			].join("\n")
		),
		`\t\t</tr>`,
		`\t</tbody>`,
		`</table>`,
	].join("\n");
}

function createLinkForSponsorship(sponsorship: SponsorshipNode) {
	const { login, name } = sponsorship.sponsorEntity;
	const url = `https://github.com/${login}`;
	const { monthlyPriceInDollars } = sponsorship.tier;
	const size =
		monthlyPriceInDollars >= 25 ? 100 : monthlyPriceInDollars >= 10 ? 50 : 25;

	return [
		`\t\t\t\t<a href="${url}">`,
		`\t\t\t\t\t<img alt="${name}" src="${url}.png?size=${size}" />`,
		`\t\t\t\t</a>`,
	].join("\n");
}

function groupByTier(sponsorships: SponsorshipNode[]) {
	const tiers = {
		Gold: [] as SponsorshipNode[],
		Silver: [] as SponsorshipNode[],
		Bronze: [] as SponsorshipNode[],
	};

	for (const sponsorship of sponsorships) {
		if (sponsorship.tier.monthlyPriceInDollars >= 25) {
			tiers.Gold.push(sponsorship);
		} else if (sponsorship.tier.monthlyPriceInDollars >= 10) {
			tiers.Silver.push(sponsorship);
		} else {
			tiers.Bronze.push(sponsorship);
		}
	}

	return tiers;
}
