import { supabase } from "@/integrations/supabase/client";

const PRODUCT_FILES_BUCKET =
  import.meta.env.VITE_SUPABASE_PRODUCT_FILES_BUCKET
  ?? import.meta.env.VITE_SUPABASE_PRODUCT_BUCKET
  ?? "products";

const PRODUCT_IMAGES_BUCKET =
  import.meta.env.VITE_SUPABASE_PRODUCT_IMAGES_BUCKET
  ?? "products-images";

const PRODUCT_FILES_MAX_MB = Number(import.meta.env.VITE_SUPABASE_PRODUCT_FILES_MAX_MB ?? "50");
const PRODUCT_IMAGES_MAX_MB = Number(import.meta.env.VITE_SUPABASE_PRODUCT_IMAGES_MAX_MB ?? "50");

function sanitizeFileName(fileName: string) {
  const parts = fileName.split(".");
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : "";
  const baseName = parts.join(".") || "file";

  const normalizedBaseName = baseName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return extension
    ? `${normalizedBaseName || "file"}.${extension}`
    : normalizedBaseName || "file";
}

export function getProductStorageBucket(kind: "apk" | "pdf" | "screenshot") {
  return kind === "screenshot" ? PRODUCT_IMAGES_BUCKET : PRODUCT_FILES_BUCKET;
}

export function getProductStorageMaxSizeMb(kind: "apk" | "pdf" | "screenshot") {
  return kind === "screenshot" ? PRODUCT_IMAGES_MAX_MB : PRODUCT_FILES_MAX_MB;
}

export function validateProductFile(file: File, kind: "apk" | "pdf" | "screenshot") {
  const maxSizeMb = getProductStorageMaxSizeMb(kind);
  const maxBytes = maxSizeMb * 1024 * 1024;

  if (file.size > maxBytes) {
    const actualSizeMb = (file.size / (1024 * 1024)).toFixed(2);

    if (kind === "apk") {
      throw new Error(
        `Bu dosya ${actualSizeMb} MB. Supabase Free plan bu boyuttaki dosyalari kabul etmez. Lütfen APK dosyasini GitHub Releases, Cloudflare R2, Google Drive veya baska bir storage servisine yükleyip public download linkini APK URL alanina yapistirin.`,
      );
    }

    const bucket = getProductStorageBucket(kind);
    throw new Error(
      `"${file.name}" dosyasi ${actualSizeMb} MB. "${bucket}" bucket limiti ${maxSizeMb} MB oldugu icin yuklenemiyor.`,
    );
  }
}

export async function uploadProductFile({
  file,
  kind,
  slug,
}: {
  file: File;
  kind: "apk" | "pdf" | "screenshot";
  slug: string;
}) {
  const bucket = getProductStorageBucket(kind);
  validateProductFile(file, kind);
  const timestamp = Date.now();
  const safeFileName = sanitizeFileName(file.name);
  const path = `${slug}/${kind}/${timestamp}-${safeFileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || undefined,
    });

  if (error) {
    throw new Error(
      `Storage upload failed for bucket "${bucket}" (${kind}): ${error.message}`,
    );
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
