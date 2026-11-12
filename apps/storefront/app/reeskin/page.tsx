import React from "react";
import { listProducts } from "../../lib/catalog";
import ReeSkinBrandPage from "./reeskin-client";

export const dynamic = "force-dynamic";

export default async function Page() {
  const res = await listProducts({ limit: 100 });
  return <ReeSkinBrandPage initialProducts={res?.data ?? []} />;
}
