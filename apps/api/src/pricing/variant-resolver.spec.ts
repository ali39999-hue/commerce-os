import { PrismaService } from "../database/prisma.service";
import { extractLegacySlugCandidates, resolveStoreVariants } from "./variant-resolver";

describe("variant-resolver", () => {
  it("extracts canonical slug from legacy shop variant IDs", () => {
    expect(extractLegacySlugCandidates("var-prod_shop_perfect_in_pink")).toContain(
      "perfect-in-pink",
    );
    expect(extractLegacySlugCandidates("SKU-PROD_SHOP_PERFECT_IN_PINK")).toContain(
      "perfect-in-pink",
    );
    expect(
      extractLegacySlugCandidates("e7a57c09-b2a5-4942-b850-0eb9f2575364"),
    ).toEqual([]);
  });

  it("queries Prisma with slug/SKU without passing invalid UUIDs to id.in", async () => {
    const findMany = jest.fn().mockResolvedValue([
      {
        id: "e7a57c09-b2a5-4942-b850-0eb9f2575364",
        productId: "971696f7-adbf-42e0-a328-28c114817579",
        sku: "BBW-PINK-SPY",
        titleFa: "اسپری بادی میست ۲۳۶ میلی‌لیتر شاین دار",
        priceAmount: 23500000n,
        currency: "IRR",
        product: {
          slug: "perfect-in-pink",
          titleFa: "اسپری اکلیلی بث اند بادی مدل Perfect In pink",
        },
      },
    ]);

    const prisma = {
      productVariant: { findMany },
    } as unknown as PrismaService;

    const resolved = await resolveStoreVariants(prisma, "store-1", [
      { variantId: "var-prod_shop_perfect_in_pink" },
    ]);

    const whereArg = findMany.mock.calls[0][0].where;
    expect(whereArg.OR.some((clause: Record<string, unknown>) => "id" in clause)).toBe(false);
    expect(whereArg.OR).toContainEqual({
      product: { slug: { in: ["perfect-in-pink"] }, status: "PUBLISHED" },
    });

    const hit = resolved.get("var-prod_shop_perfect_in_pink");
    expect(hit?.id).toBe("e7a57c09-b2a5-4942-b850-0eb9f2575364");
    expect(hit?.sku).toBe("BBW-PINK-SPY");
    expect(hit?.priceAmount).toBe(23500000n);
  });
});
