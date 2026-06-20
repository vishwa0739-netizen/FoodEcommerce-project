// app/account/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountNav } from "@/components/account/AccountNav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: orderTotals } = await supabase
    .from("orders")
    .select("total")
    .eq("user_id", user.id);

  const { count: wishlistCount } = await supabase
    .from("wishlist")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const stats = {
    orders: ordersCount ?? 0,
    spent: orderTotals?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0,
    wishlist: wishlistCount ?? 0,
  };

  const resolvedProfile = {
    id: user.id,
    first_name: profile?.first_name ?? "",
    last_name: profile?.last_name ?? "",
    phone: profile?.phone ?? null,
    email: user.email ?? "",
    avatar_url: profile?.avatar_url ?? null,
    birthday: profile?.birthday ?? null,
    created_at: user.created_at,
  };

  return (
    // Mobile base: single column, full-width, no max-width constraint.
    // desktop:: becomes a two-column grid with a fixed-width sidebar rail.
    <div className="min-h-screen bg-background desktop:mx-auto desktop:max-w-[1200px] desktop:grid desktop:grid-cols-[260px_1fr] desktop:gap-32 desktop:px-32 desktop:py-48">
      {/* Sidebar rail — on mobile this is just the header + nav stacked
          at the top of the page; on desktop it becomes a sticky left column. */}
      <aside className="desktop:sticky desktop:top-48 desktop:self-start desktop:h-fit">
        <AccountHeader profile={resolvedProfile} stats={stats} />
        <AccountNav profileName={`${resolvedProfile.first_name} ${resolvedProfile.last_name}`} />
      </aside>

      {/* Content panel — full width on mobile (the active section renders
          here below the nav list), becomes the right column on desktop. */}
      <main className="min-w-0">{children}</main>
    </div>
  );
}