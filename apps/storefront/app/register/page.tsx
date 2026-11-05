import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "../../components/auth/auth-card";

export const metadata: Metadata = {
  title: "ثبت‌نام و عضویت | دکتر درمر",
  description: "ایجاد حساب کاربری جدید در فروشگاه و سامانه تخصصی سلامت و درمان پوست دکتر درمر.",
};

interface RegisterPageProps {
  searchParams?: Promise<{ redirect?: string }>;
}

async function RegisterContent({ searchParams }: RegisterPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const redirectTo = resolvedParams.redirect || "/account";

  return <AuthCard initialMode="signup" redirectTo={redirectTo} />;
}

export default function RegisterPage(props: RegisterPageProps) {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>در حال بارگذاری...</div>}>
      <RegisterContent {...props} />
    </Suspense>
  );
}
