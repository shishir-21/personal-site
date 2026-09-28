import { ResumeData } from "../lib/resume/types";
import { parseHighlights } from "./parseHighlights";
import { Timeline } from "./Timeline";

const resumeData: ResumeData = {
    experiences: [
      {
        company: "ModelSuite AI",
        period: "Jun. 2026 – Present",
        positions: [
          {
            title: "Full Stack Developer Intern",
            description: [
              `Built features for an {{AI-powered SaaS platform}}, including messaging, meeting scheduling, and workflow automation.`,
              `Developed {{REST APIs}} using Node.js, Express.js, and MongoDB. Also integrated {{Google OAuth}} and {{Google Meet}}.`,
            ],
          },
        ],
      },
      {
        company: "Bluestock Fintech Pvt. Ltd.",
        period: "Feb. 2026 – Apr. 2026",
        positions: [
          {
            title: "Software Developer Intern",
            description: [
              `Worked on a {{stock trading platform}} using React.js, Node.js, Django, and PostgreSQL.`,
              `Integrated REST APIs and used {{Pytest}} to test features and find bugs.`,
            ],
          },
        ],
      },
      {
        company: "Tata Motors Ltd.",
        period: "Jan. 2025 – Mar. 2025",
        positions: [
          {
            title: "Software Developer Intern",
            description: [
              `Led a team of {{four interns}} to build a Ticket Management System used by over {{1,000 employees}}.`,
              `Developed backend services and REST APIs using Node.js, Express.js, and MongoDB.`,
            ],
          },
        ],
      },
      {
        company: "Dr. B.C. Roy Engineering College",
        period: "2022 – 2026",
        positions: [
          {
            title: "B.Tech – Computer Science & Engineering (Data Science)",
            description: [
              `Studied {{Computer Science and Data Science}}, learning software development, databases, web technologies, and AI.`,
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
