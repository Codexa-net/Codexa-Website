// -----------------------------------------------------------------------------
// Mock data layer for the Codexa dashboard.
// In production these getters would be swapped for real API / DB calls, but the
// shapes below match the fields shown across every dashboard screen.
// -----------------------------------------------------------------------------

export type ProjectStatus = "قيد التنفيذ" | "قيد المراجعة" | "مكتمل" | "متأخر";
export type Priority = "عالية" | "متوسطة" | "منخفضة";

export interface TeamMember {
  name: string;
  initials: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  category: string;
  tags?: string[];
  technologies: string[];
  cover?: string;
  liveUrl?: string;
  themeFrom: string;
  themeTo: string;
  manager: TeamMember;
  designer: TeamMember;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  deadline: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  industry: string;
  totalRevenue: number;
}

export type ServiceStatus = "مكتمل" | "قيد المراجعة" | "متأخر";

export interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  status: ServiceStatus;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  status: "جديد" | "تمت القراءة";
  message: string;
}

export interface SystemUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
}

const team = {
  omar: { name: "عمر أحمد", initials: "عأ", color: "#60A5FA" },
  codexa: { name: "فريق كودكسا", initials: "كك", color: "#34D399" },
  sara: { name: "سارة محمد", initials: "سم", color: "#F472B6" },
  ahmad: { name: "أحمد علي", initials: "أع", color: "#60A5FA" },
  nour: { name: "نور أحمد", initials: "نأ", color: "#34D399" },
  hoda: { name: "هدى سليم", initials: "هس", color: "#FBBF24" },
  layla: { name: "ليلى فؤاد", initials: "لف", color: "#F87171" },
  mona: { name: "منى إبراهيم", initials: "من", color: "#38BDF8" },
  dina: { name: "دينا سامي", initials: "دس", color: "#FB923C" },
};

export const projects: Project[] = [
  {
    id: "p1",
    name: "مستشفى النور",
    description: "نظام إلكتروني متكامل لإدارة المستشفيات، يشمل لوحات تحكم بصلاحيات متعددة وحجز مواعيد للمرضى.",
    client: "مستشفى النور",
    category: "مواقع",
    tags: ["web", "ui"],
    technologies: ["PHP", "SQL", "HTML/CSS", "JavaScript"],
    cover: "/projects/alnour.jpg",
    liveUrl: "https://alnour-hospital.great-site.net/?i=2",
    themeFrom: "#022c22",
    themeTo: "#047857",
    manager: team.omar,
    designer: team.codexa,
    status: "مكتمل",
    priority: "عالية",
    progress: 100,
    deadline: "2026-05-01",
    updatedAt: "2026-05-10",
  },
  {
    id: "p2",
    name: "منصة احجزلي (E7gzly)",
    description: "نظام حجوزات ذكي (وداعاً لزحمة غرف الانتظار)، يتيح للعملاء حجز المواعيد والحصول على تنبيهات حية لدورهم.",
    client: "احجزلي",
    category: "مواقع",
    tags: ["web", "ui"],
    technologies: ["Next.js", "React", "Node.js"],
    cover: "/projects/e7gzly.png",
    liveUrl: "https://e7gzly.vercel.app/",
    themeFrom: "#1e3a8a",
    themeTo: "#2563eb",
    manager: team.omar,
    designer: team.codexa,
    status: "مكتمل",
    priority: "عالية",
    progress: 100,
    deadline: "2026-08-01",
    updatedAt: "2026-08-20",
  },
  {
    id: "p3",
    name: "متجر ShopMart",
    description: "منصة تجارة إلكترونية سريعة لتصفح المنتجات، إدارة عربة التسوق، وإتمام الطلبات بسلاسة بتجربة مستخدم عصرية.",
    client: "ShopMart",
    category: "مواقع",
    tags: ["web", "ui"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    cover: "/projects/ecommerce.jpg",
    liveUrl: "https://e-commerce-94.vercel.app/",
    themeFrom: "#171717",
    themeTo: "#404040",
    manager: team.omar,
    designer: team.codexa,
    status: "مكتمل",
    priority: "متوسطة",
    progress: 100,
    deadline: "2026-06-01",
    updatedAt: "2026-06-15",
  },
  {
    id: "p4",
    name: "SwimFlow",
    description: "تطبيق سباحة متكامل لمدربين السباحة، يديرلك شغلك وجداول الحصص ومتابعة المتدربين بكل سهولة.",
    client: "SwimFlow",
    category: "تطبيقات",
    tags: ["mobile", "ui"],
    technologies: ["Mobile Dev", "Supabase", "UI/UX"],
    cover: "/projects/swimflow.jpeg",
    themeFrom: "#082f49",
    themeTo: "#0284c7",
    manager: team.omar,
    designer: team.codexa,
    status: "مكتمل",
    priority: "عالية",
    progress: 100,
    deadline: "2026-09-09",
    updatedAt: "2026-09-09",
  },
  {
    id: "p5",
    name: "Movito App",
    description: "تطبيق ترفيهي لاكتشاف ومتابعة أحدث الأفلام والمسلسلات بواجهة مستخدم عصرية وجذابة تعتمد على الوضع الليلي.",
    client: "Movito",
    category: "تطبيقات",
    tags: ["mobile", "ui"],
    technologies: ["Mobile Dev", "UI/UX", "API"],
    cover: "/projects/movito.jpeg",
    themeFrom: "#0f172a",
    themeTo: "#312e81",
    manager: team.omar,
    designer: team.codexa,
    status: "مكتمل",
    priority: "متوسطة",
    progress: 100,
    deadline: "2026-07-15",
    updatedAt: "2026-07-20",
  }
];

export const clients: Client[] = [
  { id: "c1", name: "مستشفى النور", contact: "إدارة المستشفى", industry: "رعاية صحية", totalRevenue: 15000 },
  { id: "c2", name: "احجزلي", contact: "إدارة المنصة", industry: "خدمات رقمية", totalRevenue: 8500 },
  { id: "c3", name: "ShopMart", contact: "إدارة المتجر", industry: "تجارة إلكترونية", totalRevenue: 12000 },
  { id: "c4", name: "SwimFlow", contact: "إدارة التطبيق", industry: "رياضة ولياقة", totalRevenue: 5000 },
  { id: "c5", name: "Movito", contact: "إدارة التطبيق", industry: "ترفيه", totalRevenue: 7000 },
];

export const services: Service[] = [
  { id: "s1", name: "تطوير المواقع", category: "برمجة هندسية", basePrice: 4000, status: "مكتمل" },
  { id: "s2", name: "تصميم واجهات UI/UX", category: "برمجة هندسية", basePrice: 4000, status: "قيد المراجعة" },
  { id: "s3", name: "تطبيقات الموبايل", category: "برمجة هندسية", basePrice: 6000, status: "مكتمل" },
];

export const contactRequests: ContactRequest[] = [
  {
    id: "r1",
    name: "سارة أحمد",
    email: "s.ahmad@example.com",
    subject: "استفسار عن بناء منصة CRM",
    date: "2026-10-24",
    status: "جديد",
    message:
      "مرحباً فريق Codexa،\n\nنحن مهتمون ببناء نظام CRM داخلي لشركتنا. لدينا حوالي 50 مستخدم ونحتاج لميزات مخصصة.\n\nهل يمكننا تحديد موعد لمكالمة اكتشاف هذا الأسبوع؟",
  },
  {
    id: "r2",
    name: "محمد فهد",
    email: "m.fahad@fintech.io",
    subject: "طلب تحديث واجهات تطبيق",
    date: "2026-10-22",
    status: "تمت القراءة",
    message: "مرحباً، نرغب في تحديث واجهات تطبيقنا البنكي لتتوافق مع الهوية الجديدة. هل يمكن جدولة اجتماع؟",
  },
];

export const users: SystemUser[] = [
  { id: "u1", name: "عمر أحمد", initials: "عأ", email: "admin@codexa.com", role: "Super Admin" },
];

export const statusStyles: Record<string, string> = {
  "قيد التنفيذ": "bg-blue-50 text-blue-600",
  "قيد المراجعة": "bg-amber-50 text-amber-600",
  "مكتمل": "bg-emerald-50 text-emerald-600",
  "متأخر": "bg-rose-50 text-rose-600",
  "جديد": "bg-blue-50 text-blue-600",
  "تمت القراءة": "bg-gray-100 text-gray-500",
};

export const projectStatusDistribution = [
  { name: "مكتملة", value: 42, color: "#22c55e" },
  { name: "قيد التنفيذ", value: 28, color: "#4f46e5" },
  { name: "تحت المراجعة", value: 14, color: "#f59e0b" },
  { name: "متأخرة", value: 6, color: "#ef4444" },
];

export const priorityStyles: Record<string, string> = {
  "عالية": "bg-rose-50 text-rose-600",
  "متوسطة": "bg-amber-50 text-amber-600",
  "منخفضة": "bg-gray-100 text-gray-500",
};