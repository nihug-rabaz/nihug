export const PORTAL_TAB_IDS = [
  "systems",
  "work",
  "capabilities",
  "about",
  "branches",
  "contact"
] as const;

export type PortalTabId = (typeof PORTAL_TAB_IDS)[number];

export const PORTAL_TABS: { id: PortalTabId; label: string }[] = [
  { id: "systems", label: "מערכות" },
  { id: "work", label: "תיק עבודות" },
  { id: "capabilities", label: "יכולות" },
  { id: "about", label: "אודות" },
  { id: "branches", label: "ענפים" },
  { id: "contact", label: "צור קשר" }
];

export function hashToPortalTab(hash: string): PortalTabId {
  const id = hash.replace(/^#/, "");
  if ((PORTAL_TAB_IDS as readonly string[]).includes(id)) return id as PortalTabId;
  return "systems";
}
