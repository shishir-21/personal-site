"use server";

import { unstable_cache } from "next/cache";
import type { GitHubStats, ContributionData } from "./types";

const GITHUB_USERNAME = "rav4nn";

async function fetchContributions(token: string): Promise<ContributionData | null> {
  // Calculate rolling 6-month window ending today
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setMonth(oneYearAgo.getMonth() - 6);

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection(from: "${oneYearAgo.toISOString()}", to: "${today.toISOString()}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error("Failed to fetch contributions:", response.status);
      return null;
    }

    const data = await response.json();
    const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return null;
    }

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
    };
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return null;
  }
}

export interface RepoStats {
  stars: number;
  forks: number;
}

export const getRepoStats = unstable_cache(
  async (owner: string, repo: string): Promise<RepoStats> => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { stars: 0, forks: 0 };

    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        }
      );
      if (!response.ok) return { stars: 0, forks: 0 };
      const data = await response.json();
      return { stars: data.stargazers_count ?? 0, forks: data.forks_count ?? 0 };
    } catch {
      return { stars: 0, forks: 0 };
    }
  },
  ["repo-stats"],
  { revalidate: 86400 }
);

export const getGitHubStats = unstable_cache(
  async (): Promise<GitHubStats> => {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return { stars: 0, forks: 0, commits: 0, contributions: null };
    }

    try {
      // Fetch stars, forks, and commits across all repos via GraphQL
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const statsQuery = `
        query {
          user(login: "${GITHUB_USERNAME}") {
            contributionsCollection(from: "${oneYearAgo.toISOString()}", to: "${today.toISOString()}") {
              totalCommitContributions
            }
            repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
              nodes {
                stargazerCount
                forkCount
              }
            }
          }
        }
      `;

      const statsResponse = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: statsQuery }),
      });

      let stars = 0;
      let forks = 0;
      let commits = 0;

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        const user = statsData?.data?.user;
        if (user) {
          const repos: { stargazerCount: number; forkCount: number }[] =
            user.repositories.nodes;
          stars = repos.reduce((sum, r) => sum + r.stargazerCount, 0);
          forks = repos.reduce((sum, r) => sum + r.forkCount, 0);
          commits =
            user.contributionsCollection.totalCommitContributions || 0;
        }
      }

      // Fetch contribution graph data
      const contributions = await fetchContributions(token);

      return {
        stars,
        forks,
        commits,
        contributions,
      };
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      return {
        stars: 0,
        forks: 0,
        commits: 0,
        contributions: null,
      };
    }
  },
  ["github-stats"],
  { revalidate: 86400 } // Revalidate every 24 hours
);
