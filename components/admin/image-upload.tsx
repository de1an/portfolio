"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { ProjectImage } from "@/lib/project-schema";
import { LocalizedInput } from "@/components/admin/localized-field";

const EMPTY_LOCALIZED = { en: "", sr: "" };

/**
 * Uploads a file straight to the Supabase Storage 'work' bucket (RLS scopes
 * writes to the admin's own session — no server round-trip needed) and
 * renders alt-text and optional caption fields once an image is set.
 */
export function ImageUpload({
  label,
  slug,
  value,
  onChange,
  allowCaption,
  id,
  error: validationError,
  altError,
  captionError,
}: {
  label: string;
  slug: string;
  value: ProjectImage | undefined;
  onChange: (image: ProjectImage | undefined) => void;
  allowCaption?: boolean;
  /** DOM id for the wrapper — lets a validation error (e.g. missing alt text) scroll straight here. */
  id?: string;
  /** Validation error for the image itself (e.g. missing/invalid src). */
  error?: string;
  altError?: { en?: string; sr?: string };
  captionError?: { en?: string; sr?: string };
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!slug.trim()) {
      setError("Set a slug before uploading images.");
      return;
    }
    setUploading(true);
    setError("");

    try {
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => reject(new Error("Could not read image dimensions"));
        img.src = URL.createObjectURL(file);
      });

      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${slug}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("work").upload(path, file, {
        cacheControl: "3600",
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("work").getPublicUrl(path);

      onChange({
        src: data.publicUrl,
        width: dimensions.width,
        height: dimensions.height,
        alt: value?.alt ?? { ...EMPTY_LOCALIZED },
        caption: value?.caption,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      id={id}
      className={`rounded-xl border p-3 ${validationError ? "border-red-400/70 ring-1 ring-red-400/40" : "border-ink/15"}`}
    >
      <div className="mb-2 text-xs uppercase tracking-wide text-muted">{label}</div>
      {validationError && <p className="mb-2 text-xs text-red-400">{validationError}</p>}

      {value && (
        <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-card-2">
          <Image src={value.src} alt="" fill className="object-cover" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-card-2 file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-wide file:text-ink"
      />
      {uploading && <p className="mt-1.5 text-xs text-muted">Uploading…</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      {value && (
        <div className="mt-3 space-y-2">
          <LocalizedInput
            label="Alt text"
            value={value.alt}
            onChange={(alt) => onChange({ ...value, alt })}
            id={id ? `${id}-alt` : undefined}
            error={altError}
          />
          {allowCaption && (
            <LocalizedInput
              label="Caption (optional)"
              value={value.caption ?? { ...EMPTY_LOCALIZED }}
              onChange={(caption) => onChange({ ...value, caption })}
              id={id ? `${id}-caption` : undefined}
              error={captionError}
            />
          )}
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-xs text-red-400 underline hover:text-red-300"
          >
            Remove image
          </button>
        </div>
      )}
    </div>
  );
}
