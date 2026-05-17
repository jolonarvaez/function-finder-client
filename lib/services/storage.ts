import { supabase } from "@/lib/supabase";

export async function uploadEventImage(file: File, userId: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `events/${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("event-flyers").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("event-flyers").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatarImage(file: File, userId: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
