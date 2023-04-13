export interface SponsorshipTier {
	label?: string;
	minimum: number;
	size: number;
}

export interface GithubSponsorsToMarkdownOptions {
	tiers?: Record<string, SponsorshipTier>;
}

export const defaultOptions = {
	tiers: {
		Gold: {
			minimum: 25,
			size: 100,
		},
		Silver: {
			minimum: 10,
			size: 50,
		},
		Bronze: {
			minimum: 5,
			size: 25,
		},
	},
} satisfies GithubSponsorsToMarkdownOptions;
