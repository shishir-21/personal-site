import Image from "next/image";
import { GridWrapper } from "@/app/components/GridWrapper";
import { GithubSection } from "@/app/components/GithubSection";
import { getRepoStats } from "@/app/lib/stats/github-stats";
import { parseHighlights } from "@/app/components/parseHighlights";
import { GetInTouch } from "@/app/components/GetInTouch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Hardeep Singh",
  description: "Open-source projects and experiments by Hardeep Singh.",
};

interface Project {
  title: string;
  description: string;
  url: string;
  logo: string;
  stats: string[];
}

export default async function ProjectPage() {
  const [ytStats, bipStats, fluxStats] = await Promise.all([
    getRepoStats("rav4nn", "youtube-rag-scraper"),
    getRepoStats("rav4nn", "buildinpublic-x"),
    getRepoStats("rav4nn", "flux-rag"),
  ]);

  const projects: Project[] = [
    {
      title: "MediBrain",
      description:
        "Many people struggle to get quick medical guidance or access the right healthcare services. {{MediBrain (SehatSathi)}} is a full-stack healthcare platform that helps users find doctors, explore hospitals, book appointments, and track symptoms and vitals. It also includes an {{AI health assistant}} for symptom-based guidance, recovery suggestions, diet and lifestyle advice. Built with {{Next.js}}, {{NestJS}}, and {{MongoDB Atlas}}, the platform follows a {{REST API architecture}} with JWT authentication and a modular AI service layer.\n\nThe AI flow processes user symptoms and returns structured guidance such as severity, recommendations, diet suggestions, and whether to consult a doctor, with the current AI service designed as a bridge for future ML/AI API integration.",
      url: "https://github.com/shishir-21/SehatSathi",
      logo: "/projects/medibrain.webp",
      stats: ["Next.js + NestJS", "MongoDB Atlas", "AI health assistant"],
    },
    {
      title: "WhatsApp Message Intelligence",
      description:
        "Work WhatsApp groups can generate a large volume of messages, making important updates difficult to track. I built a {{message processing pipeline}} with {{WPPConnect}} to monitor one selected WhatsApp group, capture incoming messages, and store them in {{PostgreSQL}} using Prisma. Messages are sent to the {{Groq API}} for AI classification, priority detection, field extraction, and summaries. {{Zod validation}} checks structured AI responses, while a {{human review workflow}} lets users approve or correct uncertain results.\n\nBuilt as a {{full-stack AI application}} using Next.js, TypeScript, Express.js, PostgreSQL, Prisma, and Groq.",
      url: "https://github.com/shishir-21/whatsapp-message-intelligence",
      logo: "/projects/whatsapp-message-intelligence.webp",
      stats: ["WPPConnect + Puppeteer", "Groq API", "PostgreSQL + Prisma"],
    },
    {
      title: "CodeFrog AI",
      description:
        "Large codebases are difficult to understand, debug, and maintain manually. {{CodeFrog AI}} is an AI software engineering platform that connects with GitHub repositories, understands the codebase, identifies bugs and security issues, and helps generate tested code changes. It uses a {{RAG pipeline}} with repository parsing, chunking, embeddings, vector search, and LLM-based retrieval to provide codebase-aware responses.\n\nThe agent workflow can move from {{repository analysis}} to planning, code generation, testing, security checks, human approval, Git branch creation, commits, and Pull Requests. Built with {{Next.js}}, {{TypeScript}}, {{FastAPI}}, {{PostgreSQL}}, {{pgvector}}, and AI provider APIs.",
      url: "https://github.com/shishir-21/CodeFrogAI-Web",
      logo: "/projects/codefrog-ai.webp",
      stats: ["RAG + vector search", "FastAPI + PostgreSQL", "GitHub automation"],
    },
  ];

  return (
    <div className="relative space-y-16">
      <title>Projects | Hardeep Singh</title>
      <GridWrapper>
        <h1 className="mx-auto mt-16 max-w-2xl text-balance text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
          Things I&apos;ve built that people actually use.
        </h1>
      </GridWrapper>


      <GridWrapper className="space-y-4 py-6">
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
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 md:hidden">
                      <Image
                        src={project.logo}
                        alt={`${project.title} logo`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-text-primary group-hover:text-indigo-600">
                        {project.title}
                      </h2>
                      <div className="mt-1 flex flex-wrap gap-1.5">
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
      </GridWrapper>

      <GridWrapper className="pt-6">
        <GithubSection />
      </GridWrapper>

      <GetInTouch />
    </div>
  );
}
