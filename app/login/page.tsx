import { Suspense } from "react";
import { LoginPage } from "@/components/auth/LoginPage";
import { Footer } from "@/components/shared/Footer";

export default function Page() {
  return (
    <>
      <Suspense>
        <LoginPage />
      </Suspense>
      <Footer />
    </>
  );
}
