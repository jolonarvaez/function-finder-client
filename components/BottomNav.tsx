"use client";

import * as React from "react";
import { BuildingIcon, MapIcon, UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type BottomNavProps = Readonly<{
  defaultValue?: "map" | "bars" | "profile";
  mapContent?: React.ReactNode;
  barsContent?: React.ReactNode;
  profileContent?: React.ReactNode;
  className?: string;
}>;

const tabContent = [
  { name: "Map", value: "map", icon: <MapIcon />, content: "Map view" },
  { name: "Bars", value: "bars", icon: <BuildingIcon />, content: "Bars list" },
  { name: "Profile", value: "profile", icon: <UserIcon />, content: "Profile page" },
];

export function BottomNav({
  defaultValue = "map",
  mapContent,
  barsContent,
  profileContent,
  className,
}: BottomNavProps) {
  return (
    <Tabs
      defaultValue={defaultValue}
      className={cn("flex h-full flex-col", className)}
    >
      <TabsList className="w-full">
        {tabContent.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-sm"
          >
            {tab.icon}
            {tab.name}
          </TabsTrigger>
        ))}

      </TabsList>

      <TabsContent value="map" className="flex-1 overflow-auto">
        {mapContent}
      </TabsContent>
      <TabsContent value="bars" className="flex-1 overflow-auto">
        {barsContent}
      </TabsContent>
      <TabsContent value="profile" className="flex-1 overflow-auto">
        {profileContent}
      </TabsContent>
    </Tabs>
  );
}
