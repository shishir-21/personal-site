import { NewsletterSignUp } from "@/app/components/NewsletterSignUp";

import { GridWrapper } from "@/app/components/GridWrapper";
import { ProfilePicture } from "@/app/components/ProfilePicture";
import { Button } from "@/app/components/Button";
import { siteMetadata } from "@/app/data/siteMetadata";
import { fetchAndSortBlogPosts } from "@/app/lib/utils";
import { FeaturedBlogCard } from "@/app/components/FeaturedBlogCard";
import clsx from "clsx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links | Hardeep Singh",
  description: "A curated collection of useful links and resources.",
};

export default async function LinksPage() {
  const allPublishedBlogPosts = await fetchAndSortBlogPosts();
  const featuredArticles = allPublishedBlogPosts.slice(0, 4);

  return (
    <div className="relative">
      <title>Links | Hardeep Singh</title>
      <div className="space-y-12">
        <ProfilePicture />
        <GridWrapper>
          <h1 className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
            Hey, I&apos;m Hardeep!
          </h1>
        </GridWrapper>
        <GridWrapper>
          <div className="mx-auto max-w-xl text-center md:mt-8">
            <p className="leading-8 text-text-secondary">
              IIT Delhi → AI Engineer. I work with LLMs, RAG &amp; AI agents
              while building full-stack AI products that people use daily.
            </p>
          </div>
        </GridWrapper>
        <GridWrapper>
          <div className="flex justify-center space-x-4 py-4">
            <Button href="/" variant="primary">
              View my full website
            </Button>
            <Button href={siteMetadata.email} variant="secondary">
              Email me
            </Button>
          </div>
        </GridWrapper>
        <GridWrapper>
          <div className="text-center text-sm font-medium text-indigo-600">
            <span>Socials</span>
          </div>
        </GridWrapper>
        <GridWrapper>
          <div className="relative mx-auto grid max-w-2xl grid-cols-3 place-items-center justify-items-center">
            <a
              href={siteMetadata.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group no-underline transition-all duration-500 group-hover:-translate-y-3"
            >
              <div className="group inline-block text-center">
                <div className="h-28 w-28 rounded-[20px] border border-border-primary bg-bg-primary p-2 transition-all duration-300 group-hover:-translate-y-3 group-hover:border-indigo-400">
                  <div
                    className="grid h-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0]"
                    style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}
                  >
                    <svg
                      className="h-12 w-12 text-indigo-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.31 18.25C14.78 18.25 17.77 13.44 17.77 9.27C17.77 9.04 17.94 8.83 18.15 8.73C18.88 8.4 19.82 7.5 18.85 5.98C18.2 6.33 17.67 6.52 16.96 6.74C15.83 5.47 13.95 5.41 12.75 6.61C11.98 7.38 11.65 8.53 11.89 9.62C9.5 9.5 6.7 7.74 5.19 5.76C4.4 7.21 4.8 9.05 6.11 9.98C5.63 9.96 5.17 9.83 4.76 9.58V9.62C4.76 11.13 5.76 12.42 7.14 12.72C6.71 12.84 6.25 12.86 5.8 12.77C6.19 14.06 7.88 15.5 9.15 15.52C8.1 16.4 6.8 16.88 5.46 16.88C5.22 16.88 4.99 16.86 4.75 16.83C6.11 17.76 7.69 18.25 9.31 18.25V18.25Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">Twitter</p>
                </div>
              </div>
            </a>
            <a
              href={siteMetadata.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group no-underline transition-all duration-500 group-hover:-translate-y-3"
            >
              <div className="group inline-block text-center">
                <div className="h-28 w-28 rounded-[20px] border border-border-primary bg-bg-primary p-2 transition-all duration-300 group-hover:-translate-y-3 group-hover:border-indigo-400">
                  <div
                    className="grid h-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0]"
                    style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}
                  >
                    <svg
                      className="h-12 w-12 text-indigo-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.75 7.75C4.75 6.09 6.09 4.75 7.75 4.75H16.25C17.91 4.75 19.25 6.09 19.25 7.75V16.25C19.25 17.91 17.91 19.25 16.25 19.25H7.75C6.09 19.25 4.75 17.91 4.75 16.25V7.75Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M10.75 16.25V14C10.75 12.76 11.76 11.75 13 11.75C14.24 11.75 15.25 12.76 15.25 14V16.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M10.75 11.75V16.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M7.75 11.75V16.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M7.75 8.75V9.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">LinkedIn</p>
                </div>
              </div>
            </a>
            <a
              href={siteMetadata.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group no-underline transition-all duration-500 group-hover:-translate-y-3"
            >
              <div className="group inline-block text-center">
                <div className="h-28 w-28 rounded-[20px] border border-border-primary bg-bg-primary p-2 transition-all duration-300 group-hover:-translate-y-3 group-hover:border-indigo-400">
                  <div
                    className="grid h-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0]"
                    style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}
                  >
                    <svg
                      className="h-12 w-12 text-indigo-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.75 12C4.75 10.78 5.05 9.63 5.58 8.62L4.8 6.05C4.54 5.19 5.46 4.45 6.25 4.89L8.06 5.91C9.2 5.18 10.55 4.75 12 4.75C13.45 4.75 14.81 5.18 15.94 5.91L17.76 4.89C18.55 4.45 19.47 5.19 19.21 6.06L18.42 8.63C18.95 9.64 19.25 10.78 19.25 12C19.25 16 16 19.25 12 19.25C8 19.25 4.75 16 4.75 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">GitHub</p>
                </div>
              </div>
            </a>
          </div>
        </GridWrapper>

        <GridWrapper>
          <div className="text-center text-sm font-medium text-indigo-600">
            <span>Blog</span>
          </div>
        </GridWrapper>

        <div className="z-10">
          <GridWrapper>
            <ul className="z-50 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.length > 0 ? (
                <>
                  {featuredArticles.slice(0, 4).map((post, index) => (
                    <FeaturedBlogCard
                      key={post.slug}
                      slug={post.slug}
                      imageName={post.imageName}
                      title={post.title}
                      summary={post.summary}
                      className={clsx(
                        // Hide the fourth article on mobile and desktop
                        index === 3 && "hidden md:block lg:hidden",
                      )}
                    />
                  ))}
                </>
              ) : (
                <p>Nothing to see here yet...</p>
              )}
            </ul>
          </GridWrapper>
        </div>

        <NewsletterSignUp />
      </div>
    </div>
  );
}
