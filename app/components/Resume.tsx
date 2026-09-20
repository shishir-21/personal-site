import { ResumeData } from "../lib/resume/types";
import { parseHighlights } from "./parseHighlights";
import { Timeline } from "./Timeline";

const resumeData: ResumeData = {
    experiences: [
      {
        company: "4142 Ltd / Squidgy AI",
        period: "2026 – Present",
        positions: [
          {
            title: "AI Software Engineer",
            description: [
              `{{Full-time contract}} at Squidgy AI, a multi-agent AI product by 4142 Ltd (UK). Working within the engineering team on AI-powered features and {{agentic systems}}, full-time remote mapped to UK working hours.`,
            ],
          },
        ],
      },
      {
        company: "Stealth SaaS",
        period: "2026 – Present",
        positions: [
          {
            title: "Sole Engineer (Freelance)",
            description: [
              `{{End-to-end ownership}} of a {{full-stack SaaS}} product for a UK-based client — architecture, build, and production deployment. Scope includes AI-powered features and agentic workflows. Client and product details under NDA.`,
            ],
          },
        ],
      },
      {
        company: "Coffee Coach",
        period: "2025 – Present",
        positions: [
          {
            title: "Founding Engineer",
            description: [
              `Built {{Coffee Coach 0 to 1}} — a full-stack AI coaching app for specialty coffee brewers with personalised feedback via {{RAG pipelines}} and {{agentic feedback loops}}. {{65 daily active users}} acquired organically via Twitter/X and Reddit with zero paid promotion.`,
              `Now {{co-founding and productizing}} with a product partner, building towards commercial launch. Stack: Next.js on Vercel, FastAPI on Hetzner VPS with Docker, Nginx, Certbot, PostgreSQL.`,
            ],
          },
        ],
      },
      {
        company: "CovidWin",
        period: "2021",
        positions: [
          {
            title: "Operations Lead",
            description: [
              `Co-built a COVID-19 resource platform from zero to full operations in {{48 hours}} during India's second wave — {{15 states}}, 50 cities, {{10,000 verified life-saving resources}}.`,
              `Led volunteer coordination across 8 states, managing {{4,000 volunteers}} from partner organisations. Built a 15-minute automated data sync pipeline using Google Sheets API with deduplication and multi-source aggregation.`,
            ],
          },
        ],
      },
      {
        company: "Digital Marketing",
        period: "2018 – 2024",
        positions: [
          {
            title: "Freelance",
            description: [
              `Independent client work across digital marketing — SEO, content, and campaign management. Later years included lightweight {{process automation}}, leading to a full pivot into software and AI engineering in 2025.`,
            ],
          },
        ],
      },
      {
        company: "IIT Delhi",
        period: "2013 – 2018",
        positions: [
          {
            title: "Chemical Engineering",
            description: [
              `Chemical Engineering at IIT Delhi providing the {{analytical foundation}} for systems thinking and constraints-based problem solving.`,
            ],
          },
        ],
      },
    ],
    avatarUrl: "/hero_icon.webp",
};

export function Resume() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative">
          <div className="divide-y divide-gray-100">
            {resumeData.experiences.map((experience) => (
              <div
                key={experience.company}
                className="grid grid-cols-[1fr,5fr] gap-6 py-12 first:pt-0 last:pb-0 md:grid-cols-[2fr,1fr,4fr]"
              >
                <div className="hidden md:block">
                  <h3 className="text-xl font-bold">{experience.company}</h3>
                  <p className="text-sm text-gray-600">{experience.period}</p>
                </div>

                <div />

                <div className="space-y-6">
                  {experience.positions.map((position) => (
                    <div
                      key={position.title}
                      className="space-y-4"
                    >
                      <h4 className="text-lg font-semibold">
                        <span className="md:hidden">{experience.company} – </span>
                        {position.title}
                      </h4>
                      <p className="text-sm text-gray-600 md:hidden">{experience.period}</p>
                      <div className="space-y-3">
                        {position.description.map((desc) => (
                          <p key={desc} className="text-gray-600">
                            {parseHighlights(desc, "bold")}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-0 h-full w-8 md:left-[calc(28%_-_1rem)]">
            <Timeline avatarUrl={resumeData.avatarUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
