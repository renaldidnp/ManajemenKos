import {
  BedDouble,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  ReceiptText,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const adminNav: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Kos", href: "/admin/kos", icon: Building2 },
  { title: "Kamar", href: "/admin/rooms", icon: BedDouble },
  { title: "Penghuni", href: "/admin/tenants", icon: Users },
  { title: "Booking", href: "/admin/bookings", icon: CalendarCheck },
  { title: "Tagihan", href: "/admin/bills", icon: ReceiptText },
];

export const tenantNav: NavItem[] = [
  { title: "Dashboard", href: "/tenant", icon: LayoutDashboard },
];
