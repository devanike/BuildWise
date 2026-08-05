export const PLAN_SECTION_IDS = [
  "architecture",
  "authentication",
  "database",
  "api",
  "folders",
  "deployment",
  "next-steps",
  "resources",
  "general",
] as const;

export const QUESTION_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    answer: {
      type: "string",
      description:
        "The answer, in three to five sentences of plain prose. Written for a beginner: define any term you introduce, and ground the answer in this specific project rather than answering in general. Do not use markdown, headings, bullet points or code. Do not restate the question.",
    },
    relatedSection: {
      type: "string",
      description:
        "Which part of the plan this answer concerns, so the reader can be taken back to it. Use 'general' only when the question is genuinely about the plan as a whole.",
      enum: PLAN_SECTION_IDS,
    },
    suggestedFollowUps: {
      type: "array",
      description:
        "Two or three questions this answer would naturally lead a curious beginner to ask next. Each phrased as the reader would ask it, in the first person, and answerable from this plan. Do not repeat a question already asked.",
      items: { type: "string" },
    },
  },
  required: ["answer", "relatedSection", "suggestedFollowUps"],
  propertyOrdering: ["answer", "relatedSection", "suggestedFollowUps"],
} as const;
