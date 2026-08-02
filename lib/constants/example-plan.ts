export const EXAMPLE_PLAN = {
  project: {
    name: "Study Planner",
    summary:
      "A study planner that helps university students organise coursework, track deadlines and revise on a schedule.",
    targetUsers: "University students",
    scale: "Small to medium, growing over a single academic year",
  },

  overview: [
    {
      label: "Shape",
      value: "A single web application with one backend service behind it",
    },
    { label: "Data", value: "Relational, with clear links between records" },
    { label: "Accounts", value: "Email and password, plus Google sign in" },
    { label: "Delivery", value: "A managed hosting platform" },
  ],

  architecture: {
    recommendation: "A single backend service, sometimes called a monolith",
    reasoning:
      "One service is easier to build, run and reason about than several. Splitting a project into microservices adds network calls, deployment steps and failure modes, and those costs arrive immediately while the benefits only appear at a scale most projects never reach.",
    considerations: [
      "One codebase means one deployment and one place to look when something breaks.",
      "You can split a service out later if one part genuinely needs to scale on its own.",
      "Keep clear boundaries inside the code, so a future split is possible without a rewrite.",
    ],
  },

  authentication: {
    recommendation: "Email and password, with Google sign in alongside",
    reasoning:
      "Students expect to sign in with Google, and offering it removes a password they would otherwise have to remember. Keeping email and password as well means nobody is locked out if they would rather not link a Google account.",
    considerations: [
      "Verify email addresses before granting access, so accounts belong to real inboxes.",
      "Store sessions in secure, http-only cookies rather than in browser storage.",
      "Never store passwords directly. A managed auth provider handles hashing for you.",
    ],
  },

  database: {
    recommendation: "PostgreSQL",
    reasoning:
      "Your data is highly related: a student has plans, a plan has tasks, a task has a deadline. Relational databases are built for exactly those links, and they let the database enforce that a task cannot exist without its plan. PostgreSQL is also widely documented, which matters while you are still learning.",
    considerations: [
      "Model the relationships before writing queries. Getting this right early saves rework.",
      "Add indexes on the columns you filter by most, such as user and due date.",
      "A document database would suit loosely structured data better, but not this shape.",
    ],
  },

  api: {
    recommendation: "A REST API",
    reasoning:
      "REST maps neatly onto the operations this project needs, and it is the style most tutorials, tools and error messages assume. GraphQL solves a problem you do not have yet: fetching wildly different shapes of data from many clients.",
    endpoints: [
      { method: "POST", path: "/api/plans", purpose: "Create a study plan" },
      { method: "GET", path: "/api/plans", purpose: "List the signed-in user's plans" },
      { method: "GET", path: "/api/plans/:id", purpose: "Read a single plan" },
      { method: "PATCH", path: "/api/plans/:id", purpose: "Update a plan" },
      { method: "DELETE", path: "/api/plans/:id", purpose: "Delete a plan" },
      { method: "POST", path: "/api/plans/:id/tasks", purpose: "Add a task to a plan" },
    ],
  },

  folders: [
    { path: "app/", note: "Routes and pages" },
    { path: "components/", note: "Reusable interface pieces, grouped by area" },
    { path: "lib/services/", note: "Talking to the database" },
    { path: "lib/actions/", note: "Handling form submissions" },
    { path: "lib/helpers/", note: "Small shared functions" },
    { path: "types/", note: "Shared TypeScript types" },
    { path: "supabase/migrations/", note: "Database schema changes over time" },
  ],

  deployment: {
    recommendation: "A managed platform such as Vercel, with a hosted database",
    reasoning:
      "Managed hosting removes server maintenance, certificates and scaling from your list of things to learn. That attention is better spent on the application itself. You can move to your own infrastructure later if cost or control ever demands it.",
    considerations: [
      "Keep secrets in environment variables, never in the repository.",
      "Use a separate database for development and production.",
      "Set up automatic backups before real users arrive.",
    ],
  },

  resources: [
    {
      title: "Designing a relational schema",
      description:
        "How to turn the things in your project into tables, and how to link them.",
    },
    {
      title: "Sessions, tokens and cookies",
      description:
        "What actually happens when someone stays signed in, and why cookies are used.",
    },
    {
      title: "REST conventions",
      description:
        "Which HTTP method to reach for, and what each status code is telling you.",
    },
    {
      title: "Database indexing",
      description:
        "Why a query gets slow as data grows, and what an index changes.",
    },
  ],

  nextSteps: [
    {
      title: "Design the database schema",
      detail: "Write out your tables and the links between them before any code.",
    },
    {
      title: "Set up authentication",
      detail: "Get sign up, sign in and email verification working end to end.",
    },
    {
      title: "Build the core endpoints",
      detail: "Start with creating and listing plans, then add tasks.",
    },
    {
      title: "Connect the interface",
      detail: "Wire your pages to the API and handle loading and error states.",
    },
  ],
} as const;
