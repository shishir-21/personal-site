# GitHub Contribution Chart — Design Spec

**Date:** 2026-04-07

---

## Overview

Replace the current external-image-based `GithubActivityBento` with a custom-rendered contribution grid that fetches live data from the GitHub GraphQL API. Add a full GitHub section (grid + stats cards) to the `/projects` page. Remove the Blog section from the home page.

---

## Data Fetching

**File:** `app/lib/github.ts`

A single exported async function `fetchGithubData()` calls the GitHub GraphQL API at `https://api.github.com/graphql` using the `GITHUB_TOKEN` environment variable (stored in `.env.local`).

Uses `fetch` with `next: { revalidate: 3600 }` — cached and revalidated hourly by Next.js.

**GraphQL query returns:**
- `contributionCalendar.weeks` — array of weeks, each with 7 days containing `contributionCount`, `date`, and `color`
- `contributionCalendar.totalContributions` — total contributions this year
- `contributionsCollection.totalCommitContributions` — commits this year (used for Commits stat card)
- All public repos with `stargazerCount` and `forkCount` — summed in the function to produce `totalStars` and `totalForks`

**Return shape:**
```ts
{
  weeks: Week[]
  totalContributions: number
  totalStars: number
  totalForks: number
  totalCommits: number
}
```

---

## Components

### `ContributionGrid` (server component)
**File:** `app/components/ContributionGrid.tsx`

Renders the contribution calendar visually, matching the Braydon Coyer reference design:

- **Header row:** GitHub logo (SVG) + "Contributions" title + "This year" subtitle on the left; total contribution count in indigo on the right with "contributions" label below
- **Month labels:** Derived from the weeks data, positioned above the grid columns
- **Day labels:** Mon, Wed, Fri on the left side
- **Grid:** 7 rows × ~53 columns of rounded squares. Color mapped from GitHub's green scale (0 contributions = `#ebedf0` in light mode, scaling through 4 shades of green to dark green for high activity)
- **Legend:** "Less" + 5 color swatches + "More" at the bottom right

Props: `weeks`, `totalContributions`

### `GithubActivityBento` (updated)
**File:** `app/components/GithubActivityBento.tsx`

Becomes an async server component. Calls `fetchGithubData()` and passes `weeks` and `totalContributions` into `ContributionGrid`. The `BentoCard` shell and `linkTo` prop remain unchanged. Removes the current `<img>` tag.

### `GithubSection` (new)
**File:** `app/components/GithubSection.tsx`

Full-width section for the `/projects` page. Calls `fetchGithubData()` directly (separate fetch — Next.js deduplicates the request since it's the same URL + options).

Layout (matching reference screenshot):
- Left (~75%): `ContributionGrid` wrapped in a `BentoCard`
- Right (~25%): Three stacked stat cards for Stars, Forks, Commits — each with a label, large indigo number, and subtle decorative background dots/sparkles

---

## Page Changes

### `app/projects/page.tsx`
- Add `<GithubSection />` below the existing projects list
- Page becomes `async` to support the server component data fetch

### `app/page.tsx`
- Remove the entire Blog section (lines 105–149)
- Remove `fetchAndSortBlogPosts` import and call
- Remove `FeaturedBlogCard` import
- Remove `featuredArticles` variable and `clsx` import if unused

---

## Environment

`.env.local` must contain:
```
GITHUB_TOKEN=your_token_here
```

The token needs `read:user` scope to access contribution data.

---

## Error Handling

If `fetchGithubData()` throws (e.g. bad token, rate limit), the components should render a graceful fallback — empty grid with zero counts — rather than crashing the page.
