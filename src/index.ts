import { getSponsorshipsAsMaintainer } from "./getSponsorshipsAsMaintainer.js";
import {
	SponsorshipDescription,
	groupSponsorships,
} from "./groupSponsorships.js";
import { GithubSponsorsToMarkdownOptions, defaultOptions } from "./options.js";

export async function githubSponsorsToMarkdown({
	auth,
	login,
	tiers = defaultOptions.tiers,
	verbose,
}: GithubSponsorsToMarkdownOptions) {
	if (!auth) {
		if (!process.env.GH_TOKEN) {
			throw new Error(`Please provide an auth token.`);
		}

		auth = process.env.GH_TOKEN;
	}

	const logger = verbose ? console.log.bind(console) : undefined;
	const sponsorshipNodes = await getSponsorshipsAsMaintainer({
		auth,
		logger,
		login,
	});
	const tiersSorted = Object.entries(tiers).sort(
		([a], [b]) => tiers[b].minimum - tiers[a].minimum,
	);

	logger?.("Tiers, sorted:", JSON.stringify(tiersSorted, null, 4));

	const sponsorshipsSorted = sponsorshipNodes
		.filter((node) => !node.isOneTimePayment)
		.sort((a, b) => a.sponsorEntity.login.localeCompare(b.sponsorEntity.login));

	logger?.(
		"Sponsorships, sorted:",
		JSON.stringify(sponsorshipsSorted, null, 4),
	);

	const tierGroups = groupSponsorships(sponsorshipsSorted, tiersSorted);
	const width = `${Math.floor(100 / Object.keys(tierGroups).length)}%`;

	const tierGroupsSorted = Object.fromEntries(
		Object.entries(tierGroups).sort(
			([a], [b]) => tiers[b].minimum - tiers[a].minimum,
		),
	);

	return [
		`<table width="100%">`,
		`\t<thead>`,
		`\t\t<tr>`,
		...Object.keys(tierGroupsSorted).map(
			(tier) =>
				`\t\t\t<th width="${width}">${
					tiers[tier].label ?? `${tier} Sponsors`
				}</th>`,
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
			].join("\n"),
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
			`\t\t\t\t\t<img alt="${name}" height="${tier.size}px" src="${url}.png?size=${tier.size}" width="${tier.size}px" />`,
			`\t\t\t\t</a>`,
		].join("\n");
	}
}
