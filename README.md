<h1 align="center">GitHub Sponsors to Markdown</h1>

<p align="center">
	Creates a Markdown table summarizing your GitHub sponsors.
	💰
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 1" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-1-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/github-sponsors-to-markdown/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/github-sponsors-to-markdown" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/github-sponsors-to-markdown?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/github-sponsors-to-markdown/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<a href="http://npmjs.com/package/github-sponsors-to-markdown" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/github-sponsors-to-markdown?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

```shell
npm i github-sponsors-to-markdown
```

```ts
import { githubSponsorsToMarkdown } from "github-sponsors-to-markdown";

console.log(await githubSponsorsToMarkdown());
```

Note that you'll need a `GH_TOKEN` environment variable.
For example:

```shell
gh auth refresh --scopes read:user # Only necessary your first time
GH_TOKEN=$(gh auth token) node build.js
```

> See this in action on [github.com/JoshuaKGoldberg](https://github.com/JoshuaKGoldberg#thanks-to-my-sponsors)! ⚡️

### Options

`githubSponsorsToMarkdown` can be optionally be provided an options object.

```ts
await githubSponsorsToMarkdown({
	/* ... */
});
```

```ts
export interface GithubSponsorsToMarkdownOptions {
	auth: string;
	login?: string;
	tiers?: Record<string, SponsorshipTier>;
	verbose?: boolean;
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
} satisfies GithubSponsorsToMarkdownOptions;
```

#### `auth`

GitHub auth token, such as what's provided by `gh auth token`.

#### `login`

GitHub organization or username to query sponsorships for.
If not provided, defaults to querying [`viewer`](https://docs.github.com/en/graphql/reference/queries#viewer).

```ts
githubSponsorsToMarkdown({
	login: "JoshuaKGoldberg",
});
```

#### `tier`

Custom tiers to render instead of the defaults.

```ts
githubSponsorsToMarkdown({
	tiers: {
		"Also Awesome": {
			minimum: 10,
			size: 50,
		},
		Awesome: {
			label: "Best People Ever!",
			minimum: 100,
			size: 100,
		},
	},
});
```

```ts
export interface SponsorshipTier {
	label?: string;
	minimum: number;
	size: number;
}
```

#### `verbose`

Whether to `console.log` while executing.
Useful for debugging unexpected results.

```ts
githubSponsorsToMarkdown({
	verbose: true,
});
```

This will log:

- The `login` option
- The response from querying GitHub's GraphQL API
- Collected tiers from sponsorship groupings

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 💰

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg"/><br /><sub><b>Josh Goldberg</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/github-sponsors-to-markdown/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/github-sponsors-to-markdown/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/github-sponsors-to-markdown/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo engine](https://create.bingo).
