import { SponsorshipNode } from "./getSponsorshipsAsMaintainer.js";
import { SponsorshipTier } from "./options.js";

export interface SponsorshipDescription {
	sponsorship: SponsorshipNode;
	tier: SponsorshipTier;
}

export function groupSponsorships(
	sponsorships: SponsorshipNode[],
	tierEntries: [string, SponsorshipTier][],
) {
	const tierGroups: Record<string, SponsorshipDescription[]> = {};

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
