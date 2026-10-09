import { ResumeData } from "../lib/resume/types";
import { parseHighlights } from "./parseHighlights";
import { Timeline } from "./Timeline";

const resumeData: ResumeData = {
  experiences: [
    {
      company: "ModelSuite AI",
      period: "Jun. 2026 – Sep. 2026",
      positions: [
        {
          title: "Full Stack + AI Developer",
          description: [
            `Worked on the company's AI-powered SaaS platform, building features for messaging, meeting scheduling, performance tracking, and everyday team workflows.`,
            `Built backend {{APIs}} using Node.js, Express.js, and MongoDB to connect the frontend with the platform's data and features.`,
            `Added {{Google OAuth}} and {{Google Meet}} integration so users could sign in and create meeting links as part of their workflow.`,
            `Also worked on workflow automation, including an email notification feature for overdue tasks, and used GitHub to manage changes and work with the team.`,
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
            `Worked on {{real-time market data}} updates using WebSockets, so the application could show fresh data without relying only on manual page refreshes.`,
            `Worked with financial data and API integrations related to {{Yahoo Finance}} and {{Google Finance}}.`,
            `Tested backend features with {{Pytest}} and helped track down bugs during development.`,
          ],
        },
      ],
    },
    {
      company: "Tata Motors Ltd.",
      period: "Jan. 2025 – Mar. 2025",
      positions: [
        {
          title: "Software Developer Intern · Full Stack",
          description: [
            `Led a team of {{four interns}} to build a Ticket Management System for more than {{1,000 employees}}.`,
            `Built backend APIs with Node.js and Express.js and used MongoDB to store ticket and employee request data.`,
            `Worked on the ticket flow so employees could raise requests and keep track of their status.`,
            `Worked with the team to debug issues, improve database operations, and manage code using Git.`,
          ],
        },
      ],
    },
    {
      company: "Dr. B.C. Roy Engineering College",
      period: "Aug. 2022 – Jul. 2026",
      positions: [
        {
          title: "B.Tech · Computer Science & Engineering (Data Science)",
          description: [
            `Completed my B.Tech in {{Computer Science and Engineering (Data Science)}} with a {{7.08 CGPA}}.`,
            `During college, I learned core computer science concepts and applied them in web development, database, and data science projects.`,
            `One of my projects was a Raspberry Pi-based Plant Surroundings Monitoring System that collected sensor data and used machine learning as part of the monitoring process.`,
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
                    <div key={position.title} className="space-y-4">
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
