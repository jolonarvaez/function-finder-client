import { Suspense } from "react";
import { SignUpPage } from "@/components/auth/SignUpPage";

export default function Page() {
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  );
}
