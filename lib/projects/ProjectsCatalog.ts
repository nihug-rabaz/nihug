import { ProjectItem } from "@/lib/projects/ProjectItem";

export class ProjectsCatalog {
  private readonly items: ProjectItem[];

  constructor(items: ProjectItem[]) {
    this.items = items;
  }

  getAll(): ProjectItem[] {
    return [...this.items];
  }

  getFeatured(): ProjectItem | undefined {
    return this.items.find((item) => item.featured);
  }

  getCount(): number {
    return this.items.length;
  }
}

export const projectsCatalog = new ProjectsCatalog([
  new ProjectItem({
    id: "ravbot",
    name: "רב בוט",
    tagline: "עוזר AI לרבנות הצבאית",
    description:
      "ממשק שיחה חכם, חיפוש ידע מהיר ומענה אישי לחיילים ולמפקדים בכל זמן.",
    category: "ai",
    image: "/projects/5.webp",
    url: "https://www.ravbot.co.il",
    logo: "/images/ravbot-logo.png",
    year: "2025",
    featured: true,
    tileSize: "xl",
    tags: ["AI", "צ'אט", "ידע"]
  }),
  new ProjectItem({
    id: "merkaz-haprat",
    name: "מרכז הפרט",
    tagline: "מערכת שעוזרת לפרט ברבנות",
    description:
      "פלטפורמה לטיפול בפניות, מעקב סטטוס וניהול הזכאויות של הפרט מקצה לקצה.",
    category: "platform",
    image: "/projects/1.webp",
    logo: "/project-logos/merkaz-haprat.png",
    year: "2024",
    tileSize: "wide",
    tags: ["פורטל", "פניות", "פרט"]
  }),
  new ProjectItem({
    id: "hadran",
    name: "הדרן עליך",
    tagline: "תוכן ולימוד תורני יומי",
    description:
      "מערכת לניהול לימוד יומי, תכנים תורניים וסיומי מסכת לחיילי הרבנות הצבאית.",
    category: "web",
    image: "/projects/6h.webp",
    url: "https://adran-haleh.vercel.app",
    logo: "/project-logos/hadran.png",
    year: "2025",
    tileSize: "tall",
    tags: ["תורה", "לימוד יומי", "תוכן"]
  }),
  new ProjectItem({
    id: "form-246",
    name: "246",
    tagline: "מילוי טופס חללים",
    description:
      "ממשק דיגיטלי מאובטח למילוי, חתימה והעברה של טופס 246 בצורה מסודרת ויעילה.",
    category: "web",
    image: "/projects/8h.webp",
    url: "https://246.rabaz.co.il",
    year: "2024",
    tileSize: "tall",
    tags: ["טפסים", "אבטחה", "תהליך"]
  }),
  new ProjectItem({
    id: "ometz",
    name: "אומץ",
    tagline: "מערכת איסוף ותיעוד ממצאים",
    description:
      "תיעוד מובנה של ממצאים מהשטח, ניהול תיקים והפקת דוחות בזמן אמת.",
    category: "platform",
    image: "/projects/7h.webp",
    url: "https://omez.vercel.app",
    year: "2024",
    tileSize: "tall",
    tags: ["תיעוד", "ממצאים", "דוחות"]
  }),
  new ProjectItem({
    id: "chizuk",
    name: "חיזוק",
    tagline: "מערכת לניהול חללים",
    description:
      "ניהול תיקי חללים, חיבור לכל הגורמים המטפלים ומעקב רציף ברגישות מלאה.",
    category: "platform",
    image: "/projects/4.webp",
    logo: "/project-logos/chizuk.png",
    year: "2024",
    tileSize: "wide",
    tags: ["ניהול", "רגישות", "מעקב"]
  }),
  new ProjectItem({
    id: "hazuti",
    name: "הזות״י",
    tagline: "הזמנת סיורים",
    description:
      "תיאום סיורים, ניהול קבוצות, אישורים ולוחות זמנים — מכל קצוות הארגון במקום אחד.",
    category: "web",
    image: "/projects/2.webp",
    logo: "/project-logos/hazuti.png",
    year: "2024",
    tileSize: "std",
    tags: ["סיורים", "תיאום", "ניהול"]
  }),
  new ProjectItem({
    id: "tefilon",
    name: "תפילון",
    tagline: "סידור תפילה דיגיטלי",
    description:
      "אפליקציית PWA לתפילות היומיות בנוסח ספרד ועדות המזרח, עם לוח עברי, זמני היום וחוקי היום.",
    category: "mobile",
    image: "/projects/tefilon.webp",
    url: "https://sidur.rabaz.co.il",
    year: "2026",
    tileSize: "tall",
    tags: ["תפילה", "PWA", "זמנים"]
  }),
  new ProjectItem({
    id: "moreshet",
    name: "מורשת הרבנות",
    tagline: "הרבנות הצבאית במלחמת התקומה",
    description:
      "אתר תיעוד היסטורי של פעילות הרבנות הצבאית במלחמת העצמאות — סיפורים, דמויות וסרטונים.",
    category: "web",
    image: "/projects/moreshet.webp",
    url: "https://moreshet.rabaz.co.il",
    year: "2025",
    tileSize: "wide",
    tags: ["היסטוריה", "תיעוד", "מורשת"]
  }),
  new ProjectItem({
    id: "tarahit",
    name: "תרחית",
    tagline: "מרכז לוגיסטי לזיהוי נספים",
    description:
      "ניהול ממצאים וקליטות, שרשרת זיהוי ובקרה, תמונת מצב ודוחות — וממשיכה לעבוד גם ללא רשת.",
    category: "platform",
    image: "/projects/tarahit.webp",
    url: "https://tarahit.vercel.app",
    year: "2026",
    tileSize: "std",
    tags: ["חללים", "זיהוי", "לוגיסטיקה"]
  }),
  new ProjectItem({
    id: "haborer",
    name: "הבורר",
    tagline: "מערכת ניטור והכרעה",
    description:
      "מערכת ניטור והכרעה מחבילת מערכות החללים האזרחיים, לצד אומ״ץ ותרחית.",
    category: "platform",
    image: "/projects/haborer.webp",
    url: "https://haborer.rabaz.co.il",
    year: "2026",
    tileSize: "std",
    tags: ["ניטור", "הכרעה", "חללים"]
  }),
  new ProjectItem({
    id: "rabanut-360",
    name: "רבנות 360",
    tagline: "הלכה, שירות ושו״ת",
    description:
      "אפליקציה לחיילי צה״ל עם תכני הלכה, שירותי הרבנות ושאלות ותשובות — הכול במקום אחד.",
    category: "mobile",
    image: "/projects/rabanut-360.webp",
    url: "https://rabaz360-app.vercel.app",
    year: "2026",
    tileSize: "tall",
    tags: ["הלכה", "שו״ת", "שירותים"]
  }),
  new ProjectItem({
    id: "lahaka",
    name: "להקת הרבנות",
    tagline: "הגשת מועמדות ללהקה",
    description:
      "שער הכניסה למלש״בים: הגשת מועמדות ללהקת הרבנות הצבאית, מעקב סטטוס, תמונות וקליפים.",
    category: "web",
    image: "/projects/lahaka.webp",
    url: "https://kolkore.vercel.app",
    year: "2026",
    tileSize: "wide",
    tags: ["מוזיקה", "מועמדות", "מלש״בים"]
  }),
  new ProjectItem({
    id: "pesach",
    name: "מכירת חמץ",
    tagline: "מכירת חמץ דרך הרבנות",
    description:
      "טופס דיגיטלי למכירת חמץ באמצעות הרבנות הצבאית, פתוח לחיילים לקראת פסח.",
    category: "web",
    image: "/projects/pesach.webp",
    url: "https://pesach.rabaz.co.il",
    year: "2026",
    tileSize: "std",
    tags: ["פסח", "טפסים", "הלכה"]
  }),
  new ProjectItem({
    id: "two-halachot",
    name: "שתי הלכות",
    tagline: "שתי הלכות ביום מתורת המחנה",
    description:
      "שתי הלכות יומיות מתוך ספר תורת המחנה של צה״ל, מסודרות לפי לוח השנה העברי.",
    category: "web",
    image: "/projects/two-halachot.webp",
    url: "https://2halachot.vercel.app",
    year: "2025",
    tileSize: "std",
    tags: ["הלכה", "לימוד יומי", "תורת המחנה"]
  }),
  new ProjectItem({
    id: "zmanim",
    name: "זמני היום",
    tagline: "לוח זמנים הלכתיים",
    description:
      "זמני היום המדויקים לכל מקום בעולם, לפי תאריך לועזי או עברי.",
    category: "web",
    image: "/projects/zmanim.webp",
    url: "https://times.rabaz.co.il",
    year: "2025",
    tileSize: "std",
    tags: ["זמנים", "לוח עברי", "הלכה"]
  }),
  new ProjectItem({
    id: "hoger",
    name: "חוגר דיגיטלי",
    tagline: "תעודת חוגר בטלפון",
    description:
      "תעודת חוגר דיגיטלית לזיהוי חיילים ולבקרת כניסה בשערים, עם דשבורד בקרה בזמן אמת.",
    category: "mobile",
    image: "/projects/hoger.webp",
    url: "https://hoger.rabaz.co.il",
    year: "2026",
    tileSize: "tall",
    tags: ["זהות דיגיטלית", "שערים", "אפליקציה"]
  }),
  new ProjectItem({
    id: "orfi",
    name: "תאג״דים וחמ״ל",
    tagline: "תמונת מצב בזמן אמת",
    description:
      "אפליקציות שטח, מסכי שטח ודאשבורד חמ״ל שמתחברים לתמונה מבצעית אחת שמתעדכנת בזמן אמת.",
    category: "platform",
    image: "/projects/orfi.webp",
    url: "https://orfi.rabaz.co.il",
    year: "2026",
    tileSize: "wide",
    tags: ["חמ״ל", "שטח", "דאשבורד"]
  }),
  new ProjectItem({
    id: "molecule",
    name: "מולקולה בוט",
    tagline: "עוזר AI למנהלי ידע",
    description:
      "עוזר חכם למיישמי מולקולה ולמנהלי ידע ב-SharePoint.",
    category: "ai",
    image: "/projects/molecule.webp",
    url: "https://molecule.rabaz.co.il",
    year: "2026",
    tileSize: "std",
    tags: ["AI", "SharePoint", "ידע"]
  }),
  new ProjectItem({
    id: "agam",
    name: "איתור קציני דת",
    tagline: "מדור אומ״ץ",
    description:
      "מערכת לאיתור וניהול המועמדים לקורס קציני דת.",
    category: "platform",
    image: "/projects/agam.webp",
    url: "https://agam.rabaz.co.il",
    year: "2026",
    tileSize: "std",
    tags: ["גיוס", "מועמדים", "קציני דת"]
  }),
  new ProjectItem({
    id: "amir",
    name: "אמי״ר 2.0",
    tagline: "ניהול מלאי ציוד רבנותי",
    description:
      "מערכת לניהול ומעקב אחר מלאי הציוד הרבנותי בכל מתקן צבאי.",
    category: "platform",
    image: "/projects/amir.webp",
    url: "https://amir.rabaz.co.il",
    year: "2026",
    tileSize: "std",
    tags: ["מלאי", "ציוד", "מתקנים"]
  }),
  new ProjectItem({
    id: "shchakim",
    name: "שחקים",
    tagline: "אפליקציית המתפללים",
    description:
      "שחקים קונקט מחברת את המתפללים לבית הכנסת, לצד ממשק הרב לניהול הלוחות.",
    category: "mobile",
    image: "/projects/shchakim.webp",
    url: "https://shchakim-connect.rabaz.co.il",
    year: "2025",
    tileSize: "tall",
    tags: ["בית כנסת", "לוחות", "אפליקציה"]
  }),
  new ProjectItem({
    id: "maal",
    name: "מא״ל",
    tagline: "המרכז לאימונים לוגיסטיים",
    description:
      "תיאום אימונים, לומדות מקצועיות ומבחנים — במערכת אחת למרכז לאימונים לוגיסטיים.",
    category: "platform",
    image: "/projects/maal.webp",
    url: "https://maal.rabaz.co.il",
    year: "2026",
    tileSize: "wide",
    tags: ["אימונים", "לוגיסטיקה", "לומדות"]
  }),
  new ProjectItem({
    id: "shahar",
    name: "שח״ר",
    tagline: "שליטה חכמה ברכוש תקשובי",
    description:
      "ניהול, מעקב ובקרה על ציוד תקשובי — סורקת, רושמת ושולטת.",
    category: "platform",
    image: "/projects/shahar.webp",
    url: "https://shahar.rabaz.co.il",
    year: "2026",
    tileSize: "std",
    tags: ["תקשוב", "ציוד", "מעקב"]
  }),
  new ProjectItem({
    id: "pikod",
    name: "פיקוד מנצח",
    tagline: "תכנים פיקודיים לחיל הרבנות",
    description:
      "סרטונים ופודקאסטים לפיתוח מיומנויות פיקודיות וניהוליות בחיל הרבנות.",
    category: "web",
    image: "/projects/pikod.webp",
    url: "https://pikod.rabaz.co.il",
    year: "2025",
    tileSize: "std",
    tags: ["פיקוד", "וידאו", "פודקאסט"]
  }),
  new ProjectItem({
    id: "etur",
    name: "ניהול משימות",
    tagline: "משימות ליחידה הארגונית",
    description:
      "מערכת ידידותית לניהול ומעקב אחר משימות היחידה.",
    category: "platform",
    image: "/projects/etur.webp",
    url: "https://etur.rabaz.co.il",
    year: "2026",
    tileSize: "std",
    tags: ["משימות", "ניהול", "צוות"]
  })
]);
