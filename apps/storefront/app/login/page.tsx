import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "../../components/auth/auth-card";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری | دکتر درمر",
  description: "ورود به سامانه تخصصی و فروشگاه بالینی دکتر درمر.",
};

interface LoginPageProps {
  searchParams?: Promise<{ redirect?: string }>;
}

async function LoginContent({ searchParams }: LoginPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const redirectTo = resolvedParams.redirect || "/account";

  return <AuthCard initialMode="login" redirectTo={redirectTo} />;
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>در حال بارگذاری...</div>}>
      <LoginContent {...props} />
    </Suspense>
  );
}
