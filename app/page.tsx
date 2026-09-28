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

  const projects: Project[] = [
    {
      title: "MediBrain",
      description:
        "{{MediBrain (SehatSathi)}} is a full-stack healthcare platform for discovering doctors and hospitals, booking appointments, and tracking symptoms and vitals. It includes a symptom-based AI health assistant. Built with {{Next.js}}, {{NestJS}}, and {{MongoDB Atlas}}. The current AI service uses a mock implementation and is structured for future model/API integration.",
      url: "https://github.com/shishir-21/SehatSathi",
      logo: "",
      stats: ["Next.js + NestJS", "MongoDB Atlas", "Healthcare"],
    },
    {
      title: "WhatsApp Message Intelligence",
      description:
        "A {{message processing pipeline}} that monitors one selected WhatsApp group using {{WPPConnect}}, stores incoming messages in {{PostgreSQL}} with Prisma, and uses the {{Groq API}} for classification and information extraction. A review workflow lets users validate or correct AI results. Built with {{Next.js}}, {{TypeScript}}, {{Express.js}}, and Prisma.",
      url: "https://github.com/shishir-21/whatsapp-message-intelligence",
      logo: "",
      stats: ["WPPConnect", "Groq API", "PostgreSQL + Prisma"],
    },
    {
      title: "CodeFrog AI",
      description:
        "{{CodeFrog AI}} is an AI software engineering platform currently in development. It is being built around repository understanding, {{RAG}}, embeddings, vector search, and code-aware LLM workflows, with a planned agent flow for code changes and GitHub automation. Built with {{Next.js}}, {{TypeScript}}, {{FastAPI}}, {{PostgreSQL}}, and {{pgvector}}.",
      url: "https://github.com/shishir-21/CodeFrogAI-Web",
      logo: "",
      stats: ["RAG + vector search", "FastAPI", "PostgreSQL + pgvector"],
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
                Hey, I&apos;m Shishir! <br />
              </AnimatedText>
            </GridWrapper>
            <GridWrapper>
              <div className="mt-4 text-center md:mt-8">
                <AnimatedText
                  as="p"
                  delay={PARAGRAPH_DELAY}
                  className="leading-8 text-text-secondary"
                >
                  B.Tech CSE (Data Science), 2026 → Fullstack + AI Developer <br /> Currently working at Modelsuite
                  AI (Germany) and co-founding CodeFrogAI. Building full-stack AI
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
                  Here&apos;s a quick intro about me & what I love to do
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
                    From CSE to building real-world products
                  </h2>
                  <p className="mb-6 text-base leading-8 text-text-secondary">
                    I am a Computer Science Engineering student specializing in Data Science,
                    and I am passionate about building practical software products. I started
                    with full-stack development and gradually moved toward AI-powered
                    applications, working with modern technologies across frontend, backend,
                    databases, and AI systems.
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
                        alt="Shishir standing on a mountaintop overlooking a valley"
                        width={180}
                        height={270}
                      />
                    </div>
                  </div>

                  <h2 className="mb-6 w-full text-balance text-3xl font-medium leading-[40px] tracking-tighter text-text-primary">
                    Building things I actually want to exist
                  </h2>

                  <p className="mb-6 text-base leading-8 text-text-secondary">
                    I like building things that solve real-world problems and turning ideas
                    into products that people can actually use.{" "}
                    <AboutLink
                      href="https://github.com/shishir-21/SehatSathi"
                      className="inline-flex items-baseline gap-1 font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition-colors hover:text-indigo-500 hover:decoration-indigo-400"
                    >
                      MediBrain AI
                      <svg
                        className="inline h-3 w-3 shrink-0 self-center"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M3.5 3H9v5.5M9 3L3 9" />
                      </svg>
                    </AboutLink>{" "}
                    is an AI-powered healthcare platform focused on making healthcare
                    information more accessible and useful.{" "}
                    <AboutLink
                      href="https://github.com/shishir-21/whatsapp-message-intelligence"
                      className="inline-flex items-baseline gap-1 font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition-colors hover:text-indigo-500 hover:decoration-indigo-400"
                    >
                      WhatsApp Message Intelligence
                      <svg
                        className="inline h-3 w-3 shrink-0 self-center"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M3.5 3H9v5.5M9 3L3 9" />
                      </svg>
                    </AboutLink>{" "}
                    helps small businesses filter WhatsApp messages, summarize important
                    updates, identify messages that need human attention, and generate
                    natural, human-like replies using AI.
                  </p>
                </div>

  <div className="hidden lg:block">
    <div className="relative mx-auto w-fit">
      <ShadowBox width={188} height={278}></ShadowBox>
      <Image
        className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
        src="/looking-over-mountains.webp"
        alt="Shishir standing on a mountaintop overlooking a valley"
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
                      I enjoy playing video games in my free time. I love
                      mountains and photography, and I never miss a chance to explore
                      beautiful places and capture natural moments through my camera.
                      I also love meeting mountain dogs whenever I travel.
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
                        src="/plant-monitoring.webp"
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
                    During my time at Dr. B.C. Roy Engineering College, I built a{" "}
                    <AboutLink
                      href="https://github.com/shishir-21/Measuring-the-climate-around-the-plant"
                      className="inline-flex items-baseline gap-1 font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition-colors hover:text-indigo-500 hover:decoration-indigo-400"
                    >
                      Plant Surroundings Monitoring System
                      <svg
                        className="inline h-3 w-3 shrink-0 self-center"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M3.5 3H9v5.5M9 3L3 9" />
                      </svg>
                    </AboutLink>{" "}
                    using Raspberry Pi and machine learning. The device collects
                    data about soil conditions, plant health, and weather to help
                    farmers make better decisions, especially for off-season farming.
                  </p>

                  <p className="mb-6 text-base leading-8 text-text-secondary">
                    It monitors temperature, humidity, and soil moisture while
                    capturing images of plants. The system analyzes the collected
                    data to help determine the water and nutrient requirements
                    of plants, making it easier for farmers to monitor plant
                    conditions and make informed decisions.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="relative mx-auto w-fit">
                    <ShadowBox width={188} height={278}></ShadowBox>
                    <Image
                      className="absolute left-0 top-0 h-[270px] w-[180px] rotate-[8deg] rounded-lg object-cover shadow"
                      src="/plant-monitoring.webp"
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
                          {project.logo ? (
                            <Image
                              src={project.logo}
                              alt={`${project.title} logo`}
                              width={64}
                              height={64}
                              className="object-contain"
                            />
                          ) : (
                            <div
                              aria-hidden="true"
                              className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-50 text-lg font-semibold text-indigo-600"
                            >
                              {project.title.slice(0, 2).toUpperCase()}
                            </div>
                          )}
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
                      {project.logo ? (
                        <Image
                          src={project.logo}
                          alt={`${project.title} logo`}
                          width={120}
                          height={120}
                          className="object-contain"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex h-28 w-28 items-center justify-center rounded-2xl bg-indigo-50 text-3xl font-semibold text-indigo-600"
                        >
                          {project.title.slice(0, 2).toUpperCase()}
                        </div>
                      )}
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
