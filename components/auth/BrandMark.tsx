// components/auth/BrandMark.tsx
export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 mb-24">
      <div className="w-9 h-9 rounded-sm bg-wine flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gold-light">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        </svg>
      </div>
      <span className="font-display text-lg font-semibold text-wine tracking-[-0.3px]">
        La Maison
      </span>
    </div>
  );
}