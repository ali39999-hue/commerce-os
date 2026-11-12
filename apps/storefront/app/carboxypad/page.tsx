import React from "react";
import { getProduct } from "../../lib/catalog";
import CarboxypadPage from "./carboxypad-client";

export const dynamic = "force-dynamic";

export default async function Page() {
  const product = await getProduct("carboxypad");
  return <CarboxypadPage initialProduct={product} />;
}
