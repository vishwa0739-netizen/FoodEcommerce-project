// components/account/EditableRow.tsx
"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

interface EditableRowProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: "text" | "tel" | "email" | "date";
  disabled?: boolean;
}

export function EditableRow({ label, value, onSave, type = "text", disabled }: EditableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    await onSave(draft);
    setIsSaving(false);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraft(value);
    setIsEditing(false);
  }

  return (
    <div className="flex items-center py-[13px] px-16 border-b border-[var(--border-subtle)] last:border-b-0">
      <span className="text-xs text-ink-muted w-[90px] shrink-0">{label}</span>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            className="flex-1 h-8 px-2 text-sm border border-wine rounded-sm outline-none font-body"
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-emerald-600 disabled:opacity-50"
            aria-label="Save"
          >
            <Check size={16} />
          </button>
          <button onClick={handleCancel} className="text-ink-muted" aria-label="Cancel">
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <span className="text-[13px] font-medium text-ink-primary flex-1">{value || "—"}</span>
          {!disabled && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-wine"
            >
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
}