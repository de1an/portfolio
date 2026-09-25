"use client";

import type { Localized } from "@/lib/project-schema";

const inputClass =
  "w-full rounded-lg border border-ink/15 bg-card px-3 py-2 text-sm text-ink placeholder:text-faint";
const errorInputClass = "border-red-400 ring-1 ring-red-400";

type LocalizedFieldError = { en?: string; sr?: string };

type LocalizedFieldProps = {
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  /** Base id for this field — the EN/SR inputs get `${id}-en` / `${id}-sr` so a validation error can scroll straight to the offending side. */
  id?: string;
  error?: LocalizedFieldError;
};

/** One EN | SR pair of single-line inputs sharing a label — the base unit of every bilingual field. */
export function LocalizedInput({ label, value, onChange, id, error }: LocalizedFieldProps) {
  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <input
            id={id ? `${id}-en` : undefined}
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            placeholder="EN"
            className={`${inputClass} ${error?.en ? errorInputClass : ""}`}
          />
          {error?.en && <p className="mt-1 text-xs text-red-400">{error.en}</p>}
        </div>
        <div>
          <input
            id={id ? `${id}-sr` : undefined}
            value={value.sr}
            onChange={(e) => onChange({ ...value, sr: e.target.value })}
            placeholder="SR"
            className={`${inputClass} ${error?.sr ? errorInputClass : ""}`}
          />
          {error?.sr && <p className="mt-1 text-xs text-red-400">{error.sr}</p>}
        </div>
      </div>
    </div>
  );
}

/** Same as LocalizedInput but with textareas, for paragraph-length copy. */
export function LocalizedTextarea({ label, value, onChange, id, error }: LocalizedFieldProps) {
  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <textarea
            id={id ? `${id}-en` : undefined}
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            placeholder="EN"
            rows={3}
            className={`${inputClass} ${error?.en ? errorInputClass : ""}`}
          />
          {error?.en && <p className="mt-1 text-xs text-red-400">{error.en}</p>}
        </div>
        <div>
          <textarea
            id={id ? `${id}-sr` : undefined}
            value={value.sr}
            onChange={(e) => onChange({ ...value, sr: e.target.value })}
            placeholder="SR"
            rows={3}
            className={`${inputClass} ${error?.sr ? errorInputClass : ""}`}
          />
          {error?.sr && <p className="mt-1 text-xs text-red-400">{error.sr}</p>}
        </div>
      </div>
    </div>
  );
}
