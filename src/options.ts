export interface GithubSponsorsToMarkdownOptions {
	auth?: string;
	login?: string;
	tiers?: Record<string, SponsorshipTier>;
	verbose?: boolean;
}

export interface SponsorshipTier {
	label?: string;
	minimum: number;
	size: number;
}

export const defaultOptions = {
	tiers: {
		Bronze: {
			minimum: 5,
			size: 25,
		},
		Gold: {
			minimum: 25,
			size: 100,
		},
		Silver: {
			minimum: 10,
			size: 50,
		},
	},
} satisfies Omit<GithubSponsorsToMarkdownOptions, "auth">;
