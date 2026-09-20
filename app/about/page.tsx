import type { Metadata } from "next";
import { HorizontalLine } from "@/app/components/HorizontalLine";

export const metadata: Metadata = {
  title: "About | Hardeep Singh",
  description: "Learn about Hardeep Singh — software engineer, speaker, and builder of things.",
};
import { getTimeOfDayGreeting } from "app/lib/utils";
import React from "react";
import { ShadowBox } from "@/app/components/ShadowBox";
import { GridWrapper } from "@/app/components/GridWrapper";
import { Photo } from "@/app/components/Photo";
import { AboutTrackPattern } from "@/app/components/AboutTrackPattern";
import { Resume } from "@/app/components/Resume";
import { GetInTouch } from "@/app/components/GetInTouch";
import { AboutLink } from "@/app/components/AboutLink";
import { getRepoStats } from "@/app/lib/stats/github-stats";
import Image from "next/image";

// react-doctor-disable-next-line react-doctor/no-giant-component
export default async function AboutPage() {
  const timeOfDayGreeting = getTimeOfDayGreeting();
  const ytStats = await getRepoStats("rav4nn", "youtube-rag-scraper");

  return (
    <div className="relative mt-14">
      <title>About | Hardeep Singh</title>
      <div className="relative space-y-10 md:space-y-16">
        {/* Title */}
        <GridWrapper className="space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-around lg:px-24">
            <div className="order-2 mx-auto max-w-lg lg:order-1 lg:m-0 lg:max-w-3xl lg:pr-12">
              <div className="text-center text-sm font-medium text-indigo-600 lg:text-left">
                <span>{timeOfDayGreeting}</span>
              </div>
              <h1 className="mx-auto max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-5xl lg:text-left lg:text-6xl lg:leading-[64px]">
                I&apos;m Hardeep, AI engineer && problem solver.
              </h1>
            </div>
            <div className="order-1 my-12 flex-shrink-0 lg:order-2 lg:my-0">
              <div className="relative mx-auto w-full max-w-[400px]">
                <div className="relative grid grid-cols-3">
                  <div className="relative z-20 -translate-y-2">
                    <Photo
                      width={140}
                      height={140}
                      src="/chess.webp"
                      alt="Hardeep playing chess"
                      direction="left"
                    />
                  </div>
                  <div className="relative z-30">
                    <Photo
                      width={140}
                      height={140}
                      src="/hero_2.webp"
                      alt="Hardeep at a café in a pink polo, holding coffee with a bookshelf behind"
                      direction="right"
                    />
                  </div>
                  <div className="relative z-20 translate-y-4">
                    <Photo
                      width={140}
                      height={140}
                      src="/mountains-dog.webp"
                      alt="Hardeep petting a mountain dog on a trek"
                      direction="left"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GridWrapper>

        <span className="absolute left-1/2 top-40 -translate-y-1/2 translate-x-1/2">
          <HorizontalLine />
        </span>

        {/* About */}
        <div className="relative space-y-8 text-center">
          <div className="space-y-4">
            <GridWrapper>
              <div className="text-center text-sm font-medium text-indigo-600">
                <span>About</span>
              </div>
            </GridWrapper>
            <GridWrapper>
              <h2 className="mx-auto max-w-xl text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                Here&apos;s a quick intro about me && what I love to do
              </h2>
            </GridWrapper>
          </div>
          <div className="relative h-fit w-full overflow-hidden">
            <div className="absolute left-0 top-0 w-full md:left-4 lg:left-[355px] xl:left-[455px]">
              <AboutTrackPattern />
            </div>

            {/* Section 1 */}
            <div className="grid grid-cols-1 gap-8 py-12 pr-12 lg:grid-cols-2 lg:items-center lg:justify-between lg:py-32 lg:pb-20 xl:py-32">
              <div className="flex flex-col items-center text-left lg:order-2 lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <Image
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-8deg] rounded-lg object-cover shadow"
                      src="/hero.webp"
                      alt="Hardeep in a cap and puffer jacket, outdoor selfie"
                      width={180}
                      height={270}
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  From the lab to the internet
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I studied Chemical Engineering at IIT Delhi — where I learnt
                  to think in systems and optimize under constraints. What I
                  didn&apos;t expect was that the most interesting problems
                  I&apos;d encounter were messy, unstructured, and sitting
                  inside data. That&apos;s what pulled me toward software.
                </p>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  Now I build AI products that take that mess and make it
                  usable — pipelines, tooling, apps.
                </p>
              </div>
              <div className="hidden lg:order-1 lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <Image
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-8deg] rounded-lg object-cover shadow"
                    src="/hero.webp"
                    alt="Hardeep Singh"
                    width={180}
                    height={270}
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="grid grid-cols-1 gap-8 py-24 lg:grid-cols-2 lg:items-center lg:justify-between lg:pl-12">
              <div className="flex flex-col items-center text-left lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <Image
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                      src="/looking-over-mountains.webp"
                      alt="Hardeep standing on a mountaintop overlooking a valley"
                      width={180}
                      height={270}
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  Building things I actually want to exist
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I like building things that solve problems for me, and seeing
                  them become products that other people use.{" "}
                  <AboutLink
                    href="https://coffeecoach.app"
                    className="inline-flex items-baseline gap-1 font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition-colors hover:text-indigo-500 hover:decoration-indigo-400"
                  >
                    CoffeeCoach
                    <svg className="inline h-3 w-3 shrink-0 self-center" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.5 3H9v5.5M9 3L3 9" /></svg>
                  </AboutLink>{" "}
                  took off on Reddit without a single paid promotion.{" "}
                  <AboutLink
                    href="https://github.com/rav4nn/youtube-rag-scraper"
                    className="inline-flex items-baseline gap-1 font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition-colors hover:text-indigo-500 hover:decoration-indigo-400"
                  >
                    youtube-rag-scraper
                    <svg className="inline h-3 w-3 shrink-0 self-center" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.5 3H9v5.5M9 3L3 9" /></svg>
                  </AboutLink>{" "}
                  hit {ytStats.stars} GitHub stars because apparently a lot of people had
                  the same frustration with video content being impossible to
                  query.{" "}
                  <AboutLink
                    href="https://github.com/rav4nn/flux-rag"
                    className="inline-flex items-baseline gap-1 font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition-colors hover:text-indigo-500 hover:decoration-indigo-400"
                  >
                    FluxRAG
                    <svg className="inline h-3 w-3 shrink-0 self-center" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.5 3H9v5.5M9 3L3 9" /></svg>
                  </AboutLink>{" "}
                  helped me understand RAG pipelines, eval and benchmarking
                  which is enhancing my current AI Agent centric projects.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <Image
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                    src="/looking-over-mountains.webp"
                    alt="Hardeep standing on a mountaintop overlooking a valley"
                    width={180}
                    height={270}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="grid grid-cols-1 gap-8 pr-12 lg:grid-cols-2 lg:items-center lg:justify-between xl:py-24">
              <div className="flex flex-col items-center text-left lg:order-2 lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <Image
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-8deg] rounded-lg object-cover shadow"
                      src="/surgery.webp"
                      alt="Hardeep's leg post ACL surgery, in recovery"
                      width={180}
                      height={270}
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  Life beyond the screen
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I play chess obsessively. I played football every week until
                  I tore my ACL last year. Still in recovery, still bitter
                  about it. I befriend every mountain dog I meet. And I&apos;m
                  on an ongoing, probably never-ending hunt for the best chhole
                  bhature in Delhi.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <Image
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[-8deg] rounded-lg object-cover shadow"
                    src="/surgery.webp"
                    alt="Hardeep's leg post ACL surgery, in recovery"
                    width={180}
                    height={270}
                  />
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:justify-between lg:py-32 lg:pl-12 xl:py-24">
              <div className="flex flex-col items-center text-left lg:items-start">
                <div className="mb-8 lg:hidden">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <Image
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                      src="/hero_2.webp"
                      alt="Hardeep at a café in a pink polo, holding coffee with a bookshelf behind"
                      width={180}
                      height={270}
                    />
                  </div>
                </div>
                <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                  Shipping is the habit
                </h2>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  Since IIT Delhi I&apos;ve been building independently — a
                  COVID-19 crisis platform, two ongoing contracts (Squidgy AI
                  and an NDA SaaS for a UK-based client), and full-stack AI
                  products like Coffee Coach that people actually use.
                </p>
                <p className="mb-6 text-base leading-8 text-text-secondary">
                  I care about the things that matter in production — latency,
                  evaluation, hallucination rates, cost per query.{" "}
                  <AboutLink
                    href="https://github.com/rav4nn/flux-rag"
                    className="inline-flex items-baseline gap-1 font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition-colors hover:text-indigo-500 hover:decoration-indigo-400"
                  >
                    FluxRAG
                    <svg className="inline h-3 w-3 shrink-0 self-center" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.5 3H9v5.5M9 3L3 9" /></svg>
                  </AboutLink>{" "}
                  exists because I wanted to benchmark those tradeoffs properly
                  before shipping anything.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative mx-auto w-fit">
                  <ShadowBox width={188} height={278}></ShadowBox>
                  <Image
                    className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                    src="/hero_2.webp"
                    alt="Hardeep at a café in a pink polo, holding coffee with a bookshelf behind"
                    width={180}
                    height={270}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="relative space-y-8 text-center">
          <div className="space-y-4">
            <GridWrapper>
              <div className="text-center text-sm font-medium text-indigo-600">
                <span>Experience</span>
              </div>
            </GridWrapper>
            <GridWrapper>
              <h2 className="mx-auto max-w-lg text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                My work history and education timeline.
              </h2>
            </GridWrapper>
          </div>
        </div>
        <div className="space-y-16">
          <Resume />
        </div>

        <HorizontalLine />

        {/* Get In Touch */}
        <GetInTouch />

      </div>
    </div>
  );
}
