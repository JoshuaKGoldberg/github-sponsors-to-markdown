#!/usr/bin/env node

const auth = process.env.GH_TOKEN;
if (!auth) {
	throw new Error(`Please provide a process.env.GH_TOKEN.`);
}

import { githubSponsorsToMarkdown } from "../lib/index.js";
console.log(await githubSponsorsToMarkdown(auth));
