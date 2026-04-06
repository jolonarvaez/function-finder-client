"use client";

import ReactCountryFlag from "react-country-flag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, COUNTRY_ISO } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type CountrySelectProps = Readonly<{
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}>;

export function CountrySelect({ id, value, onValueChange, className }: CountrySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={cn("w-full rounded-lg", className)}>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((c) => (
          <SelectItem key={c} value={c}>
            <ReactCountryFlag
              countryCode={COUNTRY_ISO[c]}
              svg
              style={{ width: "1.2em", height: "1.2em" }}
            />
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
