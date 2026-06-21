"use client";

// ─────────────────────────────────────────────
//  CraftNest — SearchBar
//  Mobile: collapses to icon → expands full-width overlay
//  Tablet/Desktop: always inline
// ─────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from "react";
import { useDebounce, useRecentSearches } from "../hooks";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search products…",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false); // mobile overlay
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 320);
  const { recents, add: addRecent, clear: clearRecents } = useRecentSearches();

  useEffect(() => {
    onSearch(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // Auto-focus overlay input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => overlayInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (query.trim()) {
        addRecent(query.trim());
        onSearch(query.trim());
      }
      setIsFocused(false);
      setIsOpen(false);
    },
    [query, addRecent, onSearch]
  );

  const handleSelect = useCallback(
    (term: string) => {
      setQuery(term);
      addRecent(term);
      onSearch(term);
      setIsFocused(false);
      setIsOpen(false);
    },
    [addRecent, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
    overlayInputRef.current?.focus();
  }, [onSearch]);

  const showDropdown =
    isFocused && (recents.length > 0 || query.length > 0);

  // Shared inner input markup
  const SearchInput = ({
    ref: inputRefProp,
    onFocus,
    onBlur,
    isMobile = false,
  }: {
    ref: React.RefObject<HTMLInputElement | null>;
    onFocus?: () => void;
    onBlur?: () => void;
    isMobile?: boolean;
  }) => (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center ${isMobile ? "w-full" : "flex-1"}`}
    >
      <svg
        className="absolute left-3 w-4 h-4 text-[#9A8E80] pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref={inputRefProp}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        onBlur={() => {
          // slight delay so clicks on dropdown register
          setTimeout(() => {
            setIsFocused(false);
            onBlur?.();
          }, 150);
        }}
        placeholder={placeholder}
        className="
          w-full h-10 pl-9 pr-9
          bg-[#F3EFE9] border border-transparent rounded-xl
          text-sm font-['Plus_Jakarta_Sans'] text-[#1A1108] placeholder:text-[#9A8E80]
          focus:outline-none focus:border-[#bf8952] focus:bg-white
          transition-all duration-200
        "
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 w-4 h-4 text-[#9A8E80] hover:text-[#1A1108] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </form>
  );

  return (
    <>
      {/* ── Desktop/Tablet: inline ───────────── */}
      <div className="hidden sm:flex items-center relative flex-1 max-w-sm">
        <SearchInput
          ref={inputRef}
          onFocus={() => setIsFocused(true)}
        />

        {/* Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="
              absolute top-full mt-1 left-0 right-0 z-50
              bg-white border border-[#E8E4DC] rounded-xl shadow-lg overflow-hidden
            "
          >
            {recents.length > 0 && !query && (
              <>
                <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-[#9A8E80] font-['DM_Mono']">
                    Recent
                  </span>
                  <button
                    onClick={clearRecents}
                    className="text-[10px] text-[#bf8952] font-['Plus_Jakarta_Sans'] hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                {recents.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelect(term)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F3EFE9] transition-colors text-left"
                  >
                    <svg className="w-3.5 h-3.5 text-[#9A8E80] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
                    </svg>
                    <span className="text-sm font-['Plus_Jakarta_Sans'] text-[#3D2B1F] truncate">
                      {term}
                    </span>
                  </button>
                ))}
              </>
            )}
            {query && (
              <button
                onClick={() => handleSubmit()}
                className="w-full flex items-center gap-2.5 px-3 py-3 hover:bg-[#F3EFE9] transition-colors text-left"
              >
                <svg className="w-3.5 h-3.5 text-[#691626] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="text-sm font-['Plus_Jakarta_Sans'] text-[#1A1108]">
                  Search for{" "}
                  <strong className="font-semibold">&ldquo;{query}&rdquo;</strong>
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Mobile: icon trigger ─────────────── */}
      <button
        className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#F3EFE9] text-[#3D2B1F]"
        onClick={() => setIsOpen(true)}
        aria-label="Open search"
      >
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {/* ── Mobile: full-width overlay ───────── */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-[200] bg-[#FCFCF7] flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#E8E4DC]">
            <SearchInput
              ref={overlayInputRef}
              onFocus={() => setIsFocused(true)}
              isMobile
            />
            <button
              onClick={() => {
                setIsOpen(false);
                setIsFocused(false);
              }}
              className="shrink-0 text-sm font-['Plus_Jakarta_Sans'] text-[#691626] font-medium"
            >
              Cancel
            </button>
          </div>

          {/* Recents in overlay */}
          <div className="flex-1 overflow-y-auto">
            {recents.length > 0 && (
              <>
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#9A8E80] font-['DM_Mono']">
                    Recent searches
                  </span>
                  <button
                    onClick={clearRecents}
                    className="text-xs text-[#bf8952] font-['Plus_Jakarta_Sans'] hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                {recents.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelect(term)}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#F3EFE9] active:bg-[#F3EFE9] text-left"
                  >
                    <svg className="w-4 h-4 text-[#9A8E80] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
                    </svg>
                    <span className="text-sm font-['Plus_Jakarta_Sans'] text-[#1A1108]">
                      {term}
                    </span>
                  </button>
                ))}
              </>
            )}

            {!recents.length && !query && (
              <div className="px-4 pt-8 text-center">
                <p className="text-sm text-[#9A8E80] font-['Plus_Jakarta_Sans']">
                  Search for products, brands, or categories
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}