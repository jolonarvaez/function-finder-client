import { supabase } from "@/lib/supabase";

const EVENT_IMAGES_BUCKET = "event-images";

export async function uploadEventImage(file: File, userId: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const random = Math.random().toString(36).slice(2, 8);
  const path = `${userId}/${Date.now()}-${random}-${safeName}`;
  const { error } = await supabase.storage.from(EVENT_IMAGES_BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(EVENT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadEventImages(files: File[], userId: string): Promise<string[]> {
  return Promise.all(files.map((f) => uploadEventImage(f, userId)));
}

export async function uploadAvatarImage(file: File, userId: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
