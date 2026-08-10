import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
