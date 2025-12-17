import type { SearchKind } from "./searchtodo";

export type NavSection = "left" | "right";

export type NavItem =
  | { type: "keyword"; label: string; section: NavSection }
  | { type: "result"; label: string; kind: SearchKind; id: number; section: NavSection };
