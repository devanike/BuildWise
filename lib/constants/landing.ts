export const LANDING_FEATURES = [
  {
    title: "A plan with every part accounted for",
    description:
      "Describe your project once and receive an organised plan covering your backend, database, authentication and API design. Each section is laid out in the order you will need it, so nothing important is left until it is too late to change.",
  },
  {
    title: "Reasoning you can actually follow",
    description:
      "Every recommendation is explained in plain language. You see why an option suits your project, what it trades away, and the conditions under which you would sensibly choose something else instead.",
  },
  {
    title: "Choices matched to your project",
    description:
      "Suggestions are shaped by the scale and category you describe, so you are comparing a short list that genuinely fits rather than working through the entire ecosystem on your own.",
  },
  {
    title: "A clear order of work",
    description:
      "Follow an implementation roadmap that shows what to build first and how each piece connects to the ones around it, so you always know what the next step is and why it comes when it does.",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    title: "Describe your project",
    description:
      "Share what you are building, who it is for, the features you need and the scale you expect.",
  },
  {
    title: "Review your plan",
    description:
      "Read structured recommendations for your backend architecture, database, authentication and API design.",
  },
  {
    title: "Understand every decision",
    description:
      "Ask follow-up questions about any recommendation, then save the plan and return to it whenever you need it.",
  },
] as const;

export const LANDING_FAQS = [
  {
    question: "Who is BuildWise AI for?",
    answer:
      "It is built for beginner developers, students and anyone planning a backend for the first time. No prior architecture experience is needed.",
  },
  {
    question: "Does BuildWise AI write the code for me?",
    answer:
      "No. BuildWise AI helps you plan your backend and understand the reasoning behind each recommendation. You stay in control of what you build and how you build it.",
  },
  {
    question: "Do I need to know which technologies to use beforehand?",
    answer:
      "Not at all. You describe the application you have in mind, and BuildWise AI suggests suitable technologies and explains why each one fits your project.",
  },
  {
    question: "Can I ask questions about my plan?",
    answer:
      "Yes. You can ask follow-up questions about any recommendation in your plan, such as why a database was chosen or how the architecture would scale.",
  },
  {
    question: "Can I return to a plan later?",
    answer:
      "Yes. Your plans are saved to your account, so you can revisit them at any point while you are building.",
  },
  {
    question: "How is my account protected?",
    answer:
      "Accounts are secured with Supabase authentication. You can sign up with an email address and password, or continue with your Google account.",
  },
] as const;
