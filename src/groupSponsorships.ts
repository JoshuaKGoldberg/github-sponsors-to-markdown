import { SponsorshipNode } from "./getSponsorshipsAsMaintainer.ts";
import { SponsorshipTier } from "./options.ts";

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
