import type { Genre } from "@/lib/constants";

export type EventFormMode = "create" | "edit";

export type EventFormValues = {
  name: string;
  description: string | null;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  entry_price: number | null;
  genres: Genre[];
  custom_location: {
    latitude: number;
    longitude: number;
    address: string;
  };
};
