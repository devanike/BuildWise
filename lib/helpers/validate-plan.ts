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

function checkPath(path: unknown, label: string, problems: string[]) {
  if (!isObject(path)) {
    problems.push(`${label} is missing.`);
    return;
  }

  const requireText = (value: unknown, field: string) => {
    if (!text(value)) problems.push(`${label}.${field} is missing or empty.`);
  };

  const requireList = (value: unknown, field: string, min: number) => {
    if (!Array.isArray(value) || value.length < min) {
      problems.push(`${label}.${field} needs at least ${min} item(s).`);
      return false;
    }
    return true;
  };

  requireText(path.name, "name");
  requireText(path.tagline, "tagline");
  requireText(path.bestWhen, "bestWhen");

  if (requireList(path.overview, "overview", 2)) {
    (path.overview as unknown[]).forEach((item, i) => {
      if (!isObject(item)) return problems.push(`${label}.overview[${i}] is not an object.`);
      requireText(item.label, `overview[${i}].label`);
      requireText(item.value, `overview[${i}].value`);
    });
  }

  for (const key of [
    "architecture",
    "authentication",
    "database",
    "deployment",
  ] as const) {
    const block = path[key];
    if (!isObject(block)) {
      problems.push(`${label}.${key} is missing.`);
      continue;
    }
    requireText(block.recommendation, `${key}.recommendation`);
    requireText(block.reasoning, `${key}.reasoning`);
    requireText(block.learningTip, `${key}.learningTip`);
    if (requireList(block.considerations, `${key}.considerations`, 1)) {
      (block.considerations as unknown[]).forEach((item, i) => {
        if (!text(item)) problems.push(`${label}.${key}.considerations[${i}] is empty.`);
      });
    }
  }

  const api = path.api;
  if (!isObject(api)) {
    problems.push(`${label}.api is missing.`);
  } else {
    requireText(api.recommendation, "api.recommendation");
    requireText(api.reasoning, "api.reasoning");
    requireText(api.learningTip, "api.learningTip");
    if (requireList(api.endpoints, "api.endpoints", 1)) {
      (api.endpoints as unknown[]).forEach((item, i) => {
        if (!isObject(item)) return problems.push(`${label}.api.endpoints[${i}] is not an object.`);
        requireText(item.method, `api.endpoints[${i}].method`);
        requireText(item.path, `api.endpoints[${i}].path`);
        requireText(item.purpose, `api.endpoints[${i}].purpose`);
      });
    }
  }

  const lists = [
    { key: "folders", min: 1, fields: ["path", "note"] },
    { key: "resources", min: 1, fields: ["title", "description"] },
    { key: "nextSteps", min: 1, fields: ["title", "detail"] },
  ] as const;

  for (const { key, min, fields } of lists) {
    if (!requireList(path[key], key, min)) continue;
    (path[key] as unknown[]).forEach((item, i) => {
      if (!isObject(item)) return problems.push(`${label}.${key}[${i}] is not an object.`);
      for (const field of fields) requireText(item[field], `${key}[${i}].${field}`);
    });
  }
}

function liftLegacyPlan(input: Unknown): Unknown {
  const { project, ...rest } = input;

  return {
    project,
    paths: [
      {
        name: "Recommended approach",
        tagline: "The approach this plan was generated with",
        bestWhen: "This plan was created before alternatives were offered.",
        ...rest,
      },
    ],
    recommendedPath: 0,
    recommendationReason:
      "This plan was created before BuildWise AI offered more than one approach, so it describes a single way to build the project.",
  };
}

export function validatePlan(input: unknown): PlanValidation {
  if (!isObject(input)) {
    return { ok: false, problems: ["Response was not an object."] };
  }

  const candidate = Array.isArray(input.paths) ? input : liftLegacyPlan(input);

  const problems: string[] = [];

  const project = candidate.project;
  if (!isObject(project)) {
    problems.push("project is missing.");
  } else {
    for (const field of ["name", "summary", "targetUsers", "scale"] as const) {
      if (!text(project[field])) problems.push(`project.${field} is missing or empty.`);
    }
  }

  const paths = candidate.paths;
  if (!Array.isArray(paths) || paths.length === 0) {
    problems.push("paths is missing or empty.");
  } else {
    paths.forEach((path, i) => checkPath(path, `paths[${i}]`, problems));
  }

  const recommended = candidate.recommendedPath;
  if (
    typeof recommended !== "number" ||
    !Number.isInteger(recommended) ||
    !Array.isArray(paths) ||
    recommended < 0 ||
    recommended >= paths.length
  ) {
    problems.push("recommendedPath does not point at one of the paths.");
  }

  if (!text(candidate.recommendationReason)) {
    problems.push("recommendationReason is missing or empty.");
  }

  if (problems.length > 0) return { ok: false, problems };

  return { ok: true, plan: candidate as unknown as GeneratedPlan };
}
