import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Target,
  Sparkles,
  ClipboardList,
  FileBarChart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional grouping label rendered above the item. */
  group?: string;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, group: "Overview" },
  { label: "Students", href: "/students", icon: Users, group: "Manage" },
  { label: "Sessions", href: "/sessions", icon: CalendarCheck, group: "Manage" },
  { label: "Skills", href: "/skills", icon: Target, group: "Manage" },
  { label: "AI Reports", href: "/ai-reports", icon: Sparkles, group: "AI Tools" },
  { label: "Practice Plans", href: "/practice-plans", icon: ClipboardList, group: "AI Tools" },
  { label: "Reports", href: "/reports", icon: FileBarChart, group: "AI Tools" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Account" },
];
