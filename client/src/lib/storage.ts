import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const BUCKET = "listing-images"

export const imagesConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

let client: SupabaseClient | null = null
if (imagesConfigured && SUPABASE_URL && SUPABASE_ANON_KEY) {
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80)
}

function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(file)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : resolve(file)),
        "image/jpeg",
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read image file"))
    }
    img.src = url
  })
}

export async function uploadListingImages(files: File[]): Promise<string[]> {
  if (!client) {
    throw new Error("Image upload is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.")
  }
  const urls: string[] = []
  for (const file of files) {
    const blob = await compressImage(file)
    const path = `listings/${newId()}/${Date.now()}-${sanitize(file.name || "image.jpg")}`
    const { data, error } = await client.storage.from(BUCKET).upload(path, blob, {
      contentType: blob.type || "image/jpeg",
      cacheControl: "31536000",
    })
    if (error) throw new Error(error.message)
    const { data: publicUrl } = client.storage.from(BUCKET).getPublicUrl(data.path)
    urls.push(publicUrl.publicUrl)
  }
  return urls
}

export async function removeListingImage(url: string): Promise<void> {
  if (!client) return
  const path = extractPath(url)
  if (!path) return
  await client.storage.from(BUCKET).remove([path])
}

export function isSupabaseImage(url: string): boolean {
  return extractPath(url) !== null
}

function extractPath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  return idx >= 0 ? url.slice(idx + marker.length) : null
}
