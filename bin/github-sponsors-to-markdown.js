#!/usr/bin/env node

import { githubSponsorsToMarkdown } from "../dist/index.js";

console.log(await githubSponsorsToMarkdown());
