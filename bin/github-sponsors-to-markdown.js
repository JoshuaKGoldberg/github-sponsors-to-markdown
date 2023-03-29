#!/usr/bin/env node
import { githubSponsorsToMarkdown } from "../lib/index.js";
console.log(await githubSponsorsToMarkdown());
