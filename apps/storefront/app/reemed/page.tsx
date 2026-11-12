import React from "react";
import { listProducts } from "../../lib/catalog";
import ReeMedBrandPage from "./reemed-client";

export const dynamic = "force-dynamic";

export default async function Page() {
  const res = await listProducts({ limit: 100 });
  return <ReeMedBrandPage initialProducts={res?.data ?? []} />;
}
