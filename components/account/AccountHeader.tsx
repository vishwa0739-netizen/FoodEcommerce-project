// components/account/AccountHeader.tsx
import type { Profile } from "@/lib/types";

interface AccountHeaderProps {
  profile: Profile;
  stats: { orders: number; spent: number; wishlist: number };
}

export function AccountHeader({ profile, stats }: AccountHeaderProps) {
  const initial = profile.first_name?.[0]?.toUpperCase() ?? "?";
  const fullName = `${profile.first_name} ${profile.last_name}`.trim();

  return (
    <div className="bg-brand-600 px-16 pt-24 pb-48 relative overflow-hidden rounded-b-2xl desktop:rounded-2xl desktop:pb-24">
      <span
        aria-hidden="true"
        className="absolute top-0 right-[-20px] font-display italic text-[80px] text-white/[0.08] select-none whitespace-nowrap desktop:text-[48px] desktop:right-[-8px]"
      >
        La Maison
      </span>

      <div className="w-14 h-14 rounded-full bg-accent-500 flex items-center justify-center font-display text-[22px] font-semibold text-white border-[2.5px] border-white/30 mb-2.5 desktop:w-12 desktop:h-12 desktop:text-lg">
        {initial}
      </div>
      <p className="font-display text-xl italic text-white desktop:text-base">{fullName}</p>
      <p className="text-xs text-white/65 font-mono mt-0.5">{profile.email}</p>

      {/* Stats grid: 3-across on mobile, stacked rows on the narrower desktop sidebar */}
      <div className="grid grid-cols-3 desktop:grid-cols-1 gap-px bg-white/15 rounded-xl overflow-hidden mt-16 desktop:mt-12">
        <div className="bg-white/10 p-3 text-center desktop:flex desktop:items-center desktop:justify-between desktop:text-left desktop:px-4">
          <span className="block font-mono text-lg font-medium text-accent-300 desktop:inline">
            {stats.orders}
          </span>
          <span className="text-[10px] text-white/60 uppercase tracking-[0.5px] desktop:text-xs desktop:tracking-normal desktop:normal-case">
            Orders
          </span>
        </div>
        <div className="bg-white/10 p-3 text-center desktop:flex desktop:items-center desktop:justify-between desktop:text-left desktop:px-4">
          <span className="block font-mono text-lg font-medium text-accent-300 desktop:inline">
            ₹{stats.spent.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-white/60 uppercase tracking-[0.5px] desktop:text-xs desktop:tracking-normal desktop:normal-case">
            Spent
          </span>
        </div>
        <div className="bg-white/10 p-3 text-center desktop:flex desktop:items-center desktop:justify-between desktop:text-left desktop:px-4">
          <span className="block font-mono text-lg font-medium text-accent-300 desktop:inline">
            {stats.wishlist}
          </span>
          <span className="text-[10px] text-white/60 uppercase tracking-[0.5px] desktop:text-xs desktop:tracking-normal desktop:normal-case">
            Wishlist
          </span>
        </div>
      </div>
    </div>
  );
}