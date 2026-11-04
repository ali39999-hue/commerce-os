import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "../../components/auth/auth-card";

export const metadata: Metadata = {
  title: "ورود و ثبت‌نام | دکتر درمر",
  description: "ورود یا ایجاد حساب کاربری در فروشگاه رسمی و پورتال تخصصی دکتر درمر انگلستان.",
};

interface AuthPageProps {
  searchParams?: Promise<{ mode?: string; redirect?: string }>;
}

async function AuthContent({ searchParams }: AuthPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialMode = resolvedParams.mode === "login" ? "login" : "signup";
  const redirectTo = resolvedParams.redirect || "/account";

  return <AuthCard initialMode={initialMode} redirectTo={redirectTo} />;
}

export default function AuthPage(props: AuthPageProps) {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>در حال بارگذاری فرم...</div>}>
      <AuthContent {...props} />
    </Suspense>
  );
}
