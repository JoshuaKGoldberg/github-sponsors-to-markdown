import { describe, expect, it, vi } from "vitest";

import { groupSponsorships } from "./groupSponsorships.js";

describe("groupSponsorships", () => {
	it("groups sponsorships into an object", () => {
		const sponsorship = {
			isOneTimePayment: false,
			sponsorEntity: {
				login: "sponsor-login",
				name: "Sponsor Name",
			},
			tier: { id: "tier-id", monthlyPriceInDollars: 5 },
		};
		const tier = {
			minimum: 5,
			size: 10,
		};
		const actual = groupSponsorships([sponsorship], [["bronze", tier]]);

		expect(actual).toEqual({
			bronze: [{ sponsorship, tier }],
		});
	});
});
