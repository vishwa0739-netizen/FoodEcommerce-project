// components/account/AccountNav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Package,
  Heart,
  User,
  MapPin,
  Bell,
  Lock,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  {
    href: "/account/orders",
    label: "Order history",
    icon: Package,
    iconBg: "bg-brand-600/10 text-brand-600",
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
    iconBg: "bg-accent-500/15 text-accent-600",
  },
  {
    href: "/account/profile",
    label: "Profile & details",
    icon: User,
    iconBg: "bg-blue-500/10 text-blue-700",
  },
  {
    href: "/account/addresses",
    label: "Saved addresses",
    icon: MapPin,
    iconBg: "bg-emerald-500/10 text-emerald-700",
  },
] as const;

const preferenceItems = [
  {
    href: "/account/notifications",
    label: "Notifications",
    icon: Bell,
    iconBg: "bg-accent-500/15 text-accent-600",
  },
  {
    href: "/account/security",
    label: "Password & security",
    icon: Lock,
    iconBg: "bg-brand-600/10 text-brand-600",
  },
] as const;

interface AccountNavProps {
  profileName?: string;
}

export function AccountNav({ profileName }: AccountNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="px-16 pb-16 desktop:px-0 desktop:pb-0 desktop:mt-16 desktop:bg-card desktop:border desktop:border-border desktop:rounded-lg desktop:p-16">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.8px] py-16 pb-8 desktop:py-0 desktop:pb-2 desktop:px-2">
        My account
      </p>

      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              // Mobile base: full card row with icon pill, border, chevron.
              "flex items-center gap-3.5 p-3.5 bg-card rounded-md mb-2 border border-border transition-colors",
              "hover:border-brand-600",
              // Desktop: collapses into a flat, compact nav row — no card chrome.
              "desktop:bg-transparent desktop:border-0 desktop:p-2.5 desktop:rounded-md desktop:mb-0.5 desktop:hover:bg-brand-600/[0.03] desktop:hover:border-0",
              isActive && "border-brand-600 desktop:bg-brand-600/[0.06]"
            )}
          >
            <div
              className={cn(
                "w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0",
                "desktop:w-auto desktop:h-auto desktop:bg-transparent desktop:rounded-none",
                item.iconBg,
                "desktop:bg-transparent"
              )}
            >
              <item.icon
                size={18}
                className={cn(isActive ? "desktop:text-brand-600" : "desktop:text-muted-foreground")}
              />
            </div>
            <span
              className={cn(
                "flex-1 text-sm font-semibold text-foreground",
                "desktop:font-medium",
                isActive && "desktop:text-brand-600"
              )}
            >
              {item.label}
            </span>
            <ChevronRight size={16} className="text-muted-foreground desktop:hidden" />
          </Link>
        );
      })}

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.8px] py-16 pb-8 desktop:py-0 desktop:pb-2 desktop:px-2 desktop:mt-6">
        Preferences
      </p>

      {preferenceItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3.5 p-3.5 bg-card rounded-md mb-2 border border-border transition-colors",
              "hover:border-brand-600",
              "desktop:bg-transparent desktop:border-0 desktop:p-2.5 desktop:rounded-md desktop:mb-0.5 desktop:hover:bg-brand-600/[0.03] desktop:hover:border-0",
              isActive && "border-brand-600 desktop:bg-brand-600/[0.06]"
            )}
          >
            <div
              className={cn(
                "w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0",
                "desktop:w-auto desktop:h-auto desktop:rounded-none",
                item.iconBg,
                "desktop:bg-transparent"
              )}
            >
              <item.icon
                size={18}
                className={cn(isActive ? "desktop:text-brand-600" : "desktop:text-muted-foreground")}
              />
            </div>
            <span
              className={cn(
                "flex-1 text-sm font-semibold text-foreground",
                "desktop:font-medium",
                isActive && "desktop:text-brand-600"
              )}
            >
              {item.label}
            </span>
            <ChevronRight size={16} className="text-muted-foreground desktop:hidden" />
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className={cn(
          "w-full h-12 mt-4 border border-red-200 rounded-md text-red-600 text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-red-50",
          "desktop:justify-start desktop:border-0 desktop:h-auto desktop:p-2.5 desktop:mt-6"
        )}
      >
        <LogOut size={16} />
        Sign out
      </button>
    </nav>
  );
}