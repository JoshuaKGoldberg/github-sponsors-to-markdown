import {
	getSponsorshipsAsMaintainer,
	SponsorshipNode,
} from "./getSponsorshipNodes.js";
import {
	defaultOptions,
	GithubSponsorsToMarkdownOptions,
	SponsorshipTier,
} from "./options.js";

export async function githubSponsorsToMarkdown({
	login,
	tiers = defaultOptions.tiers,
	verbose,
}: GithubSponsorsToMarkdownOptions) {
	const logger = verbose ? console.log.bind(console) : undefined;
	const sponsorshipNodes = await getSponsorshipsAsMaintainer({ logger, login });
	const tiersSorted = Object.entries(tiers).sort(
		([a], [b]) => tiers[b].minimum - tiers[a].minimum
	);

	const sponsorshipsSorted = sponsorshipNodes
		.filter((node) => !node.isOneTimePayment)
		.sort((a, b) => a.sponsorEntity.login.localeCompare(b.sponsorEntity.login));

	logger?.(
		"Sponsorships, sorted:",
		JSON.stringify(sponsorshipsSorted, null, 4)
	);
	const tierGroups = groupSponsorships(sponsorshipsSorted, tiersSorted);
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
		tierEntries: [string, SponsorshipTier][]
	) {
		const tierGroups: Record<string, SponsorshipDescription[]> = {};

		logger?.("Collected tier entries:", JSON.stringify(tierEntries, null, 4));

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
}
