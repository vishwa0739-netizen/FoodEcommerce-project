// app/account/addresses/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AddressCard } from "@/components/account/AddressCard";
import { AddressFormModal } from "@/components/account/AddressFormModal";
import { Plus, MapPinOff } from "lucide-react";
import type { Address } from "@/lib/types";

export default function AddressesPage() {
  const supabase = createClient();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  async function loadAddresses() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    setAddresses(data ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  async function handleSave(form: Omit<Address, "id" | "is_default">) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingAddress) {
      await supabase.from("addresses").update(form).eq("id", editingAddress.id);
    } else {
      const isFirst = addresses.length === 0;
      await supabase
        .from("addresses")
        .insert({ ...form, user_id: user.id, is_default: isFirst });
    }

    setEditingAddress(null);
    await loadAddresses();
  }

  async function handleSetDefault(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    await loadAddresses();
  }

  return (
    <div className="px-16 desktop:px-0 pb-24">
      <div className="flex items-center justify-between pt-20 desktop:pt-0 pb-16">
        <h1 className="font-display text-xl italic text-ink-primary">Saved addresses</h1>
      </div>

      {isLoading && (
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-wine/[0.04] animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-48">
          <MapPinOff size={32} className="text-ink-muted mb-3" />
          <p className="text-sm font-medium text-ink-secondary">No addresses saved yet</p>
        </div>
      )}

      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={(a) => {
            setEditingAddress(a);
            setModalOpen(true);
          }}
          onSetDefault={handleSetDefault}
        />
      ))}

      <button
        onClick={() => {
          setEditingAddress(null);
          setModalOpen(true);
        }}
        className="w-full h-12 border border-dashed border-[var(--border-strong)] rounded-md text-wine text-sm font-semibold flex items-center justify-center gap-2 mt-2 hover:bg-wine/[0.03] transition-colors"
      >
        <Plus size={16} /> Add new address
      </button>

      <AddressFormModal
        isOpen={modalOpen}
        initial={editingAddress}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}