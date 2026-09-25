import { z } from "zod";

/** A piece of copy in both supported languages. */
const localizedSchema = z.object({
  en: z.string().min(1),
  sr: z.string().min(1),
});
export type Localized = z.infer<typeof localizedSchema>;

/** The two project types the site's copy has labels for (see lib/i18n.ts). */
export const PROJECT_TYPE_KEYS = ["tWebApp", "tSite"] as const;
export type ProjectTypeKey = (typeof PROJECT_TYPE_KEYS)[number];

const imageSchema = z.object({
  src: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: localizedSchema,
  caption: localizedSchema.optional(),
});
export type ProjectImage = z.infer<typeof imageSchema>;

export const STATUS_VALUES = ["live", "internal", "archived"] as const;
export type ProjectStatus = (typeof STATUS_VALUES)[number];

/** "Šta je bilo loše" — one problem paired with how it was solved. Optional block. */
const challengeSchema = z.object({
  problem: localizedSchema,
  solution: localizedSchema,
});

/** "Šta je sve dodato" — one delivered feature. Optional — not every project has a full list to give. */
const deliveredItemSchema = z.object({
  title: localizedSchema,
  detail: localizedSchema.optional(),
});

const timelineStepSchema = z.object({
  label: localizedSchema,
  detail: localizedSchema,
});

const metricSchema = z.object({
  value: z.string().min(1),
  label: localizedSchema,
});

const stackGroupSchema = z.object({
  group: localizedSchema,
  items: z.array(z.string().min(1)).min(1),
});

const caseStudySchema = z.object({
  year: z.string().min(1),
  role: localizedSchema,
  client: z.string().optional(),
  scope: localizedSchema.optional(),
  status: z.enum(STATUS_VALUES).optional(),
  url: z.string().url().optional(),
  context: z.array(localizedSchema).min(1),
  /** Optional — not every project has a "what went wrong" story to tell. */
  challenges: z.array(challengeSchema).default([]),
  delivered: z.array(deliveredItemSchema).default([]),
  timeline: z.array(timelineStepSchema).default([]),
  metrics: z.array(metricSchema).default([]),
  /** Optional — not every project needs a stack breakdown separate from the summary tech tags. */
  stack: z.array(stackGroupSchema).default([]),
  /** Case study galleries are capped at 5 images (also enforced by a DB constraint). */
  gallery: z.array(imageSchema).max(5).default([]),
  note: localizedSchema.optional(),
});
export type CaseStudy = z.infer<typeof caseStudySchema>;

export const projectSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  typeKey: z.enum(PROJECT_TYPE_KEYS),
  sortOrder: z.number().int(),
  published: z.boolean(),
  tech: z.array(z.string()).default([]),
  summary: localizedSchema,
  cover: imageSchema.optional(),
  hasCaseStudy: z.boolean(),
  caseStudy: caseStudySchema.optional(),
});
export type Project = z.infer<typeof projectSchema>;

/** Shape accepted from the admin form — id/timestamps are assigned by the database. */
export const projectInputSchema = projectSchema.omit({ id: true });
export type ProjectInput = z.infer<typeof projectInputSchema>;

export function pick(value: Localized, lang: "en" | "sr"): string {
  return value[lang];
}
