import { BranchItem } from "@/lib/branches/BranchItem";

export class BranchesCatalog {
  private readonly items: BranchItem[];

  constructor(items: BranchItem[]) {
    this.items = items;
  }

  getAll(): BranchItem[] {
    return [...this.items];
  }

  getCount(): number {
    return this.items.length;
  }

  // Sum of all projects delivered across every branch.
  getTotalProjects(): number {
    return this.items.reduce((sum, item) => sum + item.projectCount, 0);
  }
}

// Branch roles follow the public descriptions of the Military Rabbinate's structure;
// projects are the team's own systems, matched to the branch they serve.
export const branchesCatalog = new BranchesCatalog([
  new BranchItem({
    id: "zuk",
    name: "זו״ק",
    fullName: "זיהוי וקבורה",
    role: "טיפול בחללי צה״ל מרגע האיסוף והזיהוי ועד ההלוויה.",
    projects: ["חיזוק", "טופס 246", "תרחית", "הבורר", "אומ״ץ"]
  }),
  new BranchItem({
    id: "halacha",
    name: "הלכה",
    fullName: "ענף הלכה",
    role: "מענה הלכתי לחיילים ולצבא בשגרה ובחירום, וסדרת ׳תורת המחנה׳.",
    projects: ["רב בוט", "שתי הלכות", "רבנות 360", "מכירת חמץ", "תפילון"]
  }),
  new BranchItem({
    id: "kashrut",
    name: "כשרות",
    fullName: "ענף כשרות",
    role: "נהלי הכשרות במטבחי צה״ל, הכשרת משגיחים ובקרה.",
    projects: ["מערכת ניטור כשרות", "טופס ביקורת"]
  }),
  new BranchItem({
    id: "reut",
    name: "רעו״ת",
    fullName: "רוח, עוז ותורה",
    role: "העמקת התודעה היהודית ולימוד התורה בקרב החיילים.",
    projects: ["הדרן עלך", "הזות״י", "מורשת הרבנות"]
  }),
  new BranchItem({
    id: "toham",
    name: "תוה״ם",
    fullName: "תורה, הדרכה ומטה",
    role: "הכשרות החיל, קורס רבנים צבאיים ומוכנות לחירום.",
    projects: ["טפסי חניכה לרב הצבאי", "פיקוד מנצח", "מערכת למידה"]
  }),
  new BranchItem({
    id: "maashan",
    name: "משא״ן",
    fullName: "משאבי אנוש",
    role: "איתור, גיוס ושיבוץ כוח האדם של חיל הרבנות.",
    projects: ["איתור קציני דת", "להקת הרבנות"]
  }),
  new BranchItem({
    id: "logistics",
    name: "לוגיסטיקה",
    fullName: "מדור לוגיסטיקה",
    role: "ניהול הציוד הרבנותי והרכוש בכל מתקן צבאי.",
    projects: ["אמי״ר 2.0", "שח״ר"]
  }),
  new BranchItem({
    id: "giyur",
    name: "גיור",
    fullName: "בית הדין לגיור",
    role: "ליווי חיילים בתהליך הגיור.",
    projects: ["מערכת הגיור"]
  }),
  new BranchItem({
    id: "prat",
    name: "פרט",
    projects: ["מרכז הפרט"]
  })
]);
