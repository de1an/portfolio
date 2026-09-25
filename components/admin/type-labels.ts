import type { ProjectTypeKey } from "@/lib/project-schema";

/** Admin-only display labels for project type keys — the stored key (tWebApp/tSite) still drives lib/i18n.ts on the public site. */
export const TYPE_LABELS: Record<ProjectTypeKey, string> = {
  tWebApp: "Web Apps",
  tSite: "Website",
};
