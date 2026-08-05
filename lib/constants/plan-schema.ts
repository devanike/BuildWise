const recommendationBlock = (subject: string) => ({
  type: "object",
  description: `The ${subject} decision, with the teaching that justifies it.`,
  properties: {
    recommendation: {
      type: "string",
      description:
        "The decision itself, in one short phrase. Not a sentence, not hedged.",
    },
    reasoning: {
      type: "string",
      description:
        "Two to four sentences explaining why this suits THIS project, written for someone who has never made this decision before. Name the alternative that was not chosen and why it fits less well.",
    },
    considerations: {
      type: "array",
      description:
        "Two to four trade-offs the reader could not already work out from the recommendation itself. Each must be something that costs them, constrains them, or that they would otherwise get wrong. Do not restate what the recommendation is, and do not list its benefits. Two genuine items are better than four with padding.",
      items: { type: "string" },
    },
    learningTip: {
      type: "string",
      description:
        "One complete sentence, written in sentence case, describing a single concept the reader should go and understand so they could make this decision themselves next time, and why it helps. It must read as prose. Do not return a topic label, a heading, or Title Case, and do not restate the recommendation.",
    },
  },
  required: ["recommendation", "reasoning", "considerations", "learningTip"],
  propertyOrdering: [
    "recommendation",
    "reasoning",
    "considerations",
    "learningTip",
  ],
});

export const PLAN_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    project: {
      type: "object",
      properties: {
        name: { type: "string", description: "The project name, as given." },
        summary: {
          type: "string",
          description: "One sentence describing what the project does.",
        },
        targetUsers: { type: "string" },
        scale: {
          type: "string",
          description: "A short phrase describing expected scale.",
        },
      },
      required: ["name", "summary", "targetUsers", "scale"],
      propertyOrdering: ["name", "summary", "targetUsers", "scale"],
    },

    overview: {
      type: "array",
      description:
        "Exactly four label/value pairs for the at-a-glance card: Shape, Data, Accounts, Delivery. Values are short phrases, not sentences.",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          value: { type: "string" },
        },
        required: ["label", "value"],
        propertyOrdering: ["label", "value"],
      },
    },

    architecture: recommendationBlock("backend architecture"),
    authentication: recommendationBlock("authentication"),
    database: recommendationBlock("database"),

    api: {
      type: "object",
      properties: {
        recommendation: { type: "string" },
        reasoning: { type: "string" },
        endpoints: {
          type: "array",
          description:
            "Four to eight entries covering the project's core features. These MUST be consistent with the recommendation above: if you recommended an approach that does not use conventional HTTP routes, such as server actions or RPC, describe those operations in that approach's own terms rather than inventing REST paths alongside it. Each path must genuinely serve its stated purpose: do not label a listing route as though it returns something it would not, and give a distinct path to anything that is a distinct resource.",
          items: {
            type: "object",
            properties: {
              method: {
                type: "string",
                description:
                  "The HTTP verb, or ACTION for a server action or RPC call where no verb applies.",
                enum: ["GET", "POST", "PATCH", "PUT", "DELETE", "ACTION"],
              },
              path: {
                type: "string",
                description:
                  "The route, such as /api/plans or /api/plans/:id. For an ACTION, the function name instead, such as createPlan.",
              },
              purpose: {
                type: "string",
                description: "What it does, in a short phrase.",
              },
            },
            required: ["method", "path", "purpose"],
            propertyOrdering: ["method", "path", "purpose"],
          },
        },
        learningTip: {
          type: "string",
          description:
            "One complete sentence, written in sentence case, describing a single API design concept the reader should go and understand, and why it helps. It must read as prose. Do not return a topic label, a heading, or Title Case.",
        },
      },
      required: ["recommendation", "reasoning", "endpoints", "learningTip"],
      propertyOrdering: [
        "recommendation",
        "reasoning",
        "endpoints",
        "learningTip",
      ],
    },

    folders: {
      type: "array",
      description: "Five to eight top-level folders, each with its job.",
      items: {
        type: "object",
        properties: {
          path: { type: "string", description: "For example lib/services/" },
          note: { type: "string", description: "What belongs here." },
        },
        required: ["path", "note"],
        propertyOrdering: ["path", "note"],
      },
    },

    deployment: recommendationBlock("deployment"),

    resources: {
      type: "array",
      description:
        "Three to five concepts worth understanding before building. Topics to learn, not links.",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description:
              "The concept, in sentence case. Capitalise only the first word and any proper nouns, as in 'Designing a relational schema' or 'Sessions, tokens and cookies'. Never Title Case.",
          },
          description: {
            type: "string",
            description: "One sentence on what this teaches and why it matters.",
          },
        },
        required: ["title", "description"],
        propertyOrdering: ["title", "description"],
      },
    },

    nextSteps: {
      type: "array",
      description: "Three to five steps in the order worth doing them.",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string", description: "One sentence of guidance." },
        },
        required: ["title", "detail"],
        propertyOrdering: ["title", "detail"],
      },
    },
  },

  required: [
    "project",
    "overview",
    "architecture",
    "authentication",
    "database",
    "api",
    "folders",
    "deployment",
    "resources",
    "nextSteps",
  ],

  propertyOrdering: [
    "project",
    "overview",
    "architecture",
    "authentication",
    "database",
    "api",
    "folders",
    "deployment",
    "resources",
    "nextSteps",
  ],
} as const;
