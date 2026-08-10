import { Suspense } from "react";
import { SignUpPage } from "@/components/auth/SignUpPage";
import { Footer } from "@/components/shared/Footer";

export default function Page() {
  return (
    <>
      <Suspense>
        <SignUpPage />
      </Suspense>
      <Footer />
    </>
  );
}
