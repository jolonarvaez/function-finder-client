import type { Metadata } from "next";
import { TermsContent } from "@/components/legal/TermsContent";

export const metadata: Metadata = {
  title: "Terms and Conditions",
};

export default function TermsPage() {
  return <TermsContent />;
}
