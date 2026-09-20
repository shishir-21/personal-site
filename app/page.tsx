import type { Metadata } from "next";
import { CalendarBento } from "./components/CalendarBento";
import { ToolboxBento } from "./components/ToolboxBento";
import { AnimatedProfilePicture } from "./components/AnimatedProfilePicture";
import { AnimatedText } from "./components/AnimatedText";
import { PhotoGallery } from "./components/PhotoGallery";
import { AnimatedMobilePhotos } from "./components/AnimatedMobilePhotos";
import { GridWrapper } from "./components/GridWrapper";
import { GetInTouch } from "./components/GetInTouch";
import { ShadowBox } from "./components/ShadowBox";
import { AboutTrackPattern } from "./components/AboutTrackPattern";
import { Resume } from "./components/Resume";
import { AboutLink } from "./components/AboutLink";
import { GithubSection } from "./components/GithubSection";
import { getRepoStats } from "./lib/stats/github-stats";
import { parseHighlights } from "./components/parseHighlights";
import Image from "next/image";

interface Project {
  title: string;
  description: string;
  url: string;
  logo: string;
  stats: string[];
}

export const metadata: Metadata = {
  title: "Hardeep Singh — Software Engineer",
  description: "Software engineer, open-source contributor, and speaker. Building products at the intersection of AI and developer tooling.",
};

// react-doctor-disable-next-line react-doctor/no-giant-component
export default async function Home() {
  const PROFILE_DELAY = 0;
  const HEADING_DELAY = PROFILE_DELAY + 0.2;
  const PARAGRAPH_DELAY = HEADING_DELAY + 0.1;
  const PHOTOS_DELAY = PARAGRAPH_DELAY + 0.1;

  const [ytStats, bipStats, fluxStats] = await Promise.all([
    getRepoStats("rav4nn", "youtube-rag-scraper"),
    getRepoStats("rav4nn", "buildinpublic-x"),
    getRepoStats("rav4nn", "flux-rag"),
  ]);

  const projects: Project[] = [
    {
      title: "coffeecoach.app",
      description:
        "Most coffee brewing advice online is scattered and contradictory. I ingested high-quality brewing data, made a {{RAG pipeline}} on top of it, and built an {{agentic coaching system}} based on that data — {{LLM orchestration}} with {{feedback loops}} that adapt recommendations based on user input.\n\nWrapped it all in a {{full-stack}} AI coaching app.",
      url: "https://coffeecoach.app",
      logo: "/projects/coffee-coach.webp",
      stats: ["65 daily active users", "zero paid promotion"],
    },
    {
      title: "splitwala",
      description:
        "Can't get your friends to install the bill splitting app? This Telegram bot makes it a single command — /split, /paid, /balances. {{Lives inside your Telegram group}}. No app to download, no account to create. Built on the principle that the best UX is the one that gets out of the way.",
      url: "https://splitwala.hardeep.cv/",
      logo: "/projects/splitwala-removebg-preview.webp",
      stats: ["live in 117 groups", "2000+ active users"],
    },
    {
      title: "youtube-rag-scraper",
      description:
        "YouTube has some of the best domain-specific knowledge on the internet, but it's locked in video format, impossible to query or reuse. This pipeline bulk-scrapes transcripts, processes them, and structures them into a searchable {{knowledge base}} for RAG systems. Handles {{chunking}}, {{embedding}}, and {{retrieval quality}} out of the box.",
      url: "https://github.com/rav4nn/youtube-rag-scraper",
      logo: "/projects/youtube-rag-scraper.webp",
      stats: [
        `${ytStats.stars} GitHub stars`,
        `${ytStats.forks} forks`,
      ],
    },
    {
      title: "buildinpublic-x",
      description:
        "Most developers don't build in public because {{posting updates is friction}}. This simple GitHub Action reads your commit history over a few days, generates a thread via LLM, and posts to X and Bluesky automatically — no server, no backend, no SaaS. Lives entirely inside your repo.",
      url: "https://github.com/rav4nn/buildinpublic-x",
      logo: "/projects/buildinpublic.webp",
      stats: ["$0.01/post on X", "zero friction", "one time setup"],
    },
    {
      title: "flux-rag",
      description:
        "Most RAG systems ship without evaluation causing hallucinations to go undetected and retrieval quality degrading silently. FluxRAG inverts that: {{evaluation harness}} first, optimisation second. Drop in any file type across 10 formats, run a parameter sweep across {{chunking strategies}} and {{embedding models}}, and get a {{ranked benchmark report}} before you touch production.\n\nTracks {{latency}}, cost per query, and hallucination rate across every config because retrieval quality and {{cost tradeoffs}} shouldn't be assumptions.",
      url: "https://github.com/rav4nn/flux-rag",
      logo: "/projects/flux-rag.webp",
      stats: ["hybrid search + reranking", "async FastAPI server", "8 embedding models"],
    },
  ];

  return (
    <section>
      <AnimatedProfilePicture delay={PROFILE_DELAY} />
      <div className="mt-6 space-y-10 md:mt-0 md:space-y-16">
        {/* Hero + Photos */}
        <section>
          <div className="relative text-balance">
            <GridWrapper>
              <AnimatedText
                as="h1"
                delay={HEADING_DELAY}
                className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]"
              >
                Hey, I&apos;m Hardeep! <br />
              </AnimatedText>
            </GridWrapper>
            <GridWrapper>
              <div className="mt-4 text-center md:mt-8">
                <AnimatedText
                  as="p"
                  delay={PARAGRAPH_DELAY}
                  className="leading-8 text-text-secondary"
                >
                  IIT Delhi → AI Engineer <br /> Currently contracting at Squidgy
                  AI (UK) and co-founding Coffee Coach. Building full-stack AI
                  products with LLMs, RAG, and agentic systems.
                </AnimatedText>
              </div>
            </GridWrapper>
          </div>
          <div>
            {/* Desktop Photos */}
            <div className="relative hidden h-fit w-full items-center justify-center lg:flex">
              <PhotoGallery animationDelay={PHOTOS_DELAY} />
            </div>

            {/* Mobile Photos */}
            <AnimatedMobilePhotos delay={PHOTOS_DELAY} />
          </div>
        </section>

        {/* About Section */}
        <section className="relative">
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
              <div className="absolute right-0 top-0 bottom-0 w-full lg:right-auto lg:bottom-auto lg:left-[355px] xl:left-[455px]">
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
              <div className="grid grid-cols-1 gap-8 py-6 pr-10 lg:grid-cols-2 lg:items-center lg:justify-between lg:py-24 lg:pl-12 lg:pr-0">
                <div className="flex flex-col items-center text-left lg:items-start">
                  <div className="mb-3 lg:hidden">
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
              <div className="grid grid-cols-1 gap-8 py-6 pr-12 lg:grid-cols-2 lg:items-center lg:justify-between xl:py-24">
                <div className="flex flex-col items-center text-left lg:order-2 lg:items-start">
                  <div className="mb-3 lg:hidden">
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
                      alt="ACL recovery"
                      width={180}
                      height={270}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="grid grid-cols-1 gap-8 pr-10 lg:grid-cols-2 lg:items-center lg:justify-between lg:py-32 lg:pl-12 lg:pr-0 xl:py-24">
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
          <div className="relative space-y-8 pt-16 text-center">
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
          <div className="space-y-16 pt-8">
            <Resume />
          </div>
        </section>

        {/* Projects Section */}
        <section className="relative space-y-8 pt-16">
          <div className="space-y-4">
            <GridWrapper>
              <div className="text-center text-sm font-medium text-indigo-600">
                <span>Projects</span>
              </div>
            </GridWrapper>
            <GridWrapper>
              <h2 className="mx-auto max-w-xl text-balance text-center text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                Things I&apos;ve built that people actually use.
              </h2>
            </GridWrapper>
          </div>

          <div className="mx-auto max-w-6xl space-y-4 px-4">
            {projects.map((project, index) => {
              const isReversed = index % 2 === 1;
              return (
                <a
                  key={project.title}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all duration-200 hover:border-indigo-400 md:p-8"
                >
                  <div
                    className={`flex flex-col gap-6 md:flex-row md:items-center ${isReversed ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 md:hidden">
                          <Image
                            src={project.logo}
                            alt={`${project.title} logo`}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        </div>
                        <div className="md:pl-0 pl-1">
                          <h3 className="text-xl font-semibold tracking-tight text-text-primary group-hover:text-indigo-600">
                            {project.title}
                          </h3>
                          {/* Pills: desktop only in the header */}
                          <div className="mt-1 hidden flex-wrap gap-1.5 md:flex">
                            {project.stats.map((stat) => (
                              <span
                                key={stat}
                                className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                              >
                                {stat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {project.description.split("\n\n").map((para) => (
                          <p
                            key={para}
                            className="text-base leading-7 text-text-secondary"
                          >
                            {parseHighlights(para, "bold")}
                          </p>
                        ))}
                      </div>
                      {/* Pills: mobile only, after description */}
                      <div className="flex flex-wrap gap-1.5 md:hidden">
                        {project.stats.map((stat) => (
                          <span
                            key={stat}
                            className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                          >
                            {stat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="hidden shrink-0 items-center justify-center md:flex md:w-36">
                      <Image
                        src={project.logo}
                        alt={`${project.title} logo`}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

        </section>

        {/* Grid Section */}
        <section className="relative space-y-4 pb-8 md:pb-12">
          <GridWrapper>
            <GithubSection />
          </GridWrapper>

          <GridWrapper>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
              <div className="md:col-span-7 lg:col-span-7">
                <CalendarBento />
              </div>

              <div className="md:col-span-5 lg:col-span-5">
                <ToolboxBento linkTo="/toolbox" />
              </div>
            </div>
          </GridWrapper>
        </section>

        {/* Get In Touch */}
        <section>
          <GetInTouch />
        </section>
      </div>
    </section>
  );
}
