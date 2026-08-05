import type { GeneratedPlan } from "@/types/plans";

export type PlanValidation =
  | { ok: true; plan: GeneratedPlan }
  | { ok: false; problems: string[] };

type Unknown = Record<string, unknown>;

function isObject(value: unknown): value is Unknown {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function validatePlan(input: unknown): PlanValidation {
  const problems: string[] = [];

  if (!isObject(input)) {
    return { ok: false, problems: ["Response was not an object."] };
  }

  const requireText = (value: unknown, path: string) => {
    if (!text(value)) problems.push(`${path} is missing or empty.`);
  };

  const requireList = (value: unknown, path: string, min: number) => {
    if (!Array.isArray(value) || value.length < min) {
      problems.push(`${path} needs at least ${min} item(s).`);
      return false;
    }
    return true;
  };

  // project
  const project = input.project;
  if (!isObject(project)) {
    problems.push("project is missing.");
  } else {
    requireText(project.name, "project.name");
    requireText(project.summary, "project.summary");
    requireText(project.targetUsers, "project.targetUsers");
    requireText(project.scale, "project.scale");
  }

  // overview
  if (requireList(input.overview, "overview", 2)) {
    (input.overview as unknown[]).forEach((item, i) => {
      if (!isObject(item)) return problems.push(`overview[${i}] is not an object.`);
      requireText(item.label, `overview[${i}].label`);
      requireText(item.value, `overview[${i}].value`);
    });
  }

  // The four sections that share the recommendation shape.
  for (const key of [
    "architecture",
    "authentication",
    "database",
    "deployment",
  ] as const) {
    const block = input[key];
    if (!isObject(block)) {
      problems.push(`${key} is missing.`);
      continue;
    }
    requireText(block.recommendation, `${key}.recommendation`);
    requireText(block.reasoning, `${key}.reasoning`);
    requireText(block.learningTip, `${key}.learningTip`);
    if (requireList(block.considerations, `${key}.considerations`, 1)) {
      (block.considerations as unknown[]).forEach((item, i) => {
        if (!text(item)) problems.push(`${key}.considerations[${i}] is empty.`);
      });
    }
  }

  // api
  const api = input.api;
  if (!isObject(api)) {
    problems.push("api is missing.");
  } else {
    requireText(api.recommendation, "api.recommendation");
    requireText(api.reasoning, "api.reasoning");
    requireText(api.learningTip, "api.learningTip");
    if (requireList(api.endpoints, "api.endpoints", 1)) {
      (api.endpoints as unknown[]).forEach((item, i) => {
        if (!isObject(item)) return problems.push(`api.endpoints[${i}] is not an object.`);
        requireText(item.method, `api.endpoints[${i}].method`);
        requireText(item.path, `api.endpoints[${i}].path`);
        requireText(item.purpose, `api.endpoints[${i}].purpose`);
      });
    }
  }

  // Simple list sections.
  const lists = [
    { key: "folders", min: 1, fields: ["path", "note"] },
    { key: "resources", min: 1, fields: ["title", "description"] },
    { key: "nextSteps", min: 1, fields: ["title", "detail"] },
  ] as const;

  for (const { key, min, fields } of lists) {
    if (!requireList(input[key], key, min)) continue;
    (input[key] as unknown[]).forEach((item, i) => {
      if (!isObject(item)) return problems.push(`${key}[${i}] is not an object.`);
      for (const field of fields) requireText(item[field], `${key}[${i}].${field}`);
    });
  }

  if (problems.length > 0) return { ok: false, problems };

  return { ok: true, plan: input as unknown as GeneratedPlan };
}
