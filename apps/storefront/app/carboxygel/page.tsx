import React from 'react';
import { getProduct } from '../../lib/catalog';
import CarboxygelLandingPage from './carboxygel-client';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const product = await getProduct('carboxygel');
  return <CarboxygelLandingPage initialProduct={product} />;
}
