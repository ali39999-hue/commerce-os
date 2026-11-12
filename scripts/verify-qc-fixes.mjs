import assert from 'node:assert';

const API_BASE = 'http://localhost:4000';
const TENANT_HEADERS = {
  'content-type': 'application/json',
  'x-tenant-id': '955982e7-9a09-4bf7-b2f5-a3f2e3bc3291',
  'x-admin-api-key': 'commerce-os-admin-secret-key-2026',
};

async function test1_StorefrontCatalogVariants() {
  console.log('\n--- 1. Testing Storefront Catalog & Variants ---');
  const res = await fetch(`${API_BASE}/v1/stores/demo/products`);
  assert.strictEqual(res.status, 200, 'Catalog endpoint should return 200');
  const json = await res.json();
  assert(Array.isArray(json.data), 'Payload should contain data array');
  assert(json.data.length > 0, 'Catalog should have products');

  const p = json.data[0];
  const v = p.variants?.[0];
  console.log(`Product: "${p.titleFa || p.title}"`);
  console.log(`Variant ID (UUID): ${v?.id}`);
  console.log(`Variant SKU: ${v?.sku}`);

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v?.id);
  assert(isUuid, 'Variant ID must be a valid PostgreSQL UUID');
  assert(typeof v?.sku === 'string' && v.sku.length > 0, 'Variant SKU must be present');
  console.log('✅ Storefront catalog correctly supplies database UUID and SKU');
  return { productId: p.id, variantId: v.id, sku: v.sku, price: v.priceAmount };
}

async function test2_AdminOrdersApi() {
  console.log('\n--- 2. Testing Admin ERP Orders API ---');
  const res = await fetch(`${API_BASE}/v1/orders/admin`, { headers: TENANT_HEADERS });
  assert.strictEqual(res.status, 200, 'Admin orders endpoint should return 200');
  const json = await res.json();
  assert(Array.isArray(json.items), 'Payload should contain items array');
  assert(json.items.length > 0, 'Should return real orders from database');

  console.log(`Total live orders in DB: ${json.total}`);
  for (const o of json.items) {
    console.log(` - Order #${o.orderNumber}: ${o.customerName} | Status: ${o.status} | Amount: ${o.totalAmountTomans?.toLocaleString('fa-IR')} تومان | Method: ${o.paymentMethod}`);
    assert(o.id && o.orderNumber && o.status, 'Order must have id, orderNumber, status');
    assert(typeof o.totalAmountTomans === 'number', 'Order must have numeric totalAmountTomans');
  }
  console.log('✅ Admin ERP orders successfully connected to database');
  return json.items;
}

async function test3_OrderStatusTransition(orders) {
  console.log('\n--- 3. Testing Order Status Transition Sync ---');
  const testOrder = orders.find(o => o.status === 'PAID') || orders[0];
  console.log(`Target order: ${testOrder.orderNumber} (Current status: ${testOrder.status})`);

  let targetStatus = 'PROCESSING';
  if (testOrder.status === 'PROCESSING') {
    targetStatus = 'SHIPPED';
  } else if (testOrder.status === 'SHIPPED') {
    targetStatus = 'DELIVERED';
  }

  console.log(`Transitioning ${testOrder.orderNumber} to ${targetStatus}...`);
  const res = await fetch(`${API_BASE}/v1/orders/${encodeURIComponent(testOrder.id)}/transition`, {
    method: 'POST',
    headers: TENANT_HEADERS,
    body: JSON.stringify({
      toStatus: targetStatus,
      actor: 'OPERATOR',
      reason: 'Automated QC verification test',
    }),
  });

  assert.strictEqual(res.status, 201, 'Status transition should return 201');
  const updated = await res.json();
  assert.strictEqual(updated.status, targetStatus, `Updated status must be ${targetStatus}`);
  console.log(`Transition confirmed: ${updated.orderNumber} is now ${updated.status}`);

  // Verify fetch admin orders reflects the change
  const refreshRes = await fetch(`${API_BASE}/v1/orders/admin`, { headers: TENANT_HEADERS });
  const refreshJson = await refreshRes.json();
  const found = refreshJson.items.find(o => o.id === testOrder.id);
  assert.strictEqual(found?.status, targetStatus, 'Admin order listing must reflect the transitioned status');
  console.log('✅ Order status transition verified end-to-end with database persistence');
}

async function main() {
  console.log('🚀 Starting QC Integration Verification...');
  await test1_StorefrontCatalogVariants();
  const orders = await test2_AdminOrdersApi();
  await test3_OrderStatusTransition(orders);
  console.log('\n🎉 ALL 3 QUALITY CONTROL ISSUES RESOLVED AND VERIFIED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
