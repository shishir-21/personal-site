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
            `Built production-ready features for an {{AI-powered SaaS platform}}, including messaging, meeting scheduling, performance tracking, and workflow automation.`,
            `Developed backend {{REST APIs}} and data models with Node.js, Express.js, and MongoDB to support collaboration and workflow features.`,
            `Integrated {{Google OAuth}} and {{Google Meet}} to support account authentication and meeting workflows inside the platform.`,
            `Contributed to AI-assisted workflow automation, including automated email notifications for overdue tasks, and collaborated through Agile sprints, GitHub issues, and code reviews.`,
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
            `Worked on a {{stock trading platform}} using React.js, Node.js, Django, and PostgreSQL, contributing to features across the frontend and backend.`,
            `Worked with {{real-time data}} workflows and WebSocket-based updates to help deliver timely market information in the application.`,
            `Integrated REST APIs and worked with financial data sources, including Yahoo Finance and Google Finance-related data workflows.`,
            `Used {{Pytest}} to test features, identify bugs, and help prevent regressions while collaborating in an Agile development workflow.`,
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
            `Led a team of {{four interns}} to build a Ticket Management System used by more than {{1,000 employees}}.`,
            `Built backend services and {{REST APIs}} with Node.js and Express.js, using MongoDB to store and manage ticket and workflow data.`,
            `Helped design ticket workflows for raising, tracking, and managing employee requests, with a focus on clear status tracking and usability.`,
            `Improved database operations and coordinated team development using Git-based workflows, task breakdown, and collaborative debugging.`,
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
            `Completed a B.Tech in {{Computer Science and Engineering (Data Science)}} with a {{7.08 CGPA}}.`,
            `Built a foundation in programming, data structures, databases, web development, and data science through coursework and practical projects.`,
            `Applied classroom learning in projects such as a Raspberry Pi-based Plant Surroundings Monitoring System using IoT sensors and machine learning.`,
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
