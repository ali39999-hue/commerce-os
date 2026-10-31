import { PrismaService } from "./prisma.service";

/**
 * Tenant Scoper Extension for Prisma Client.
 * Ensures BOLA/IDOR defense by strictly binding tenant queries.
 */
export function getTenantScopedPrisma(prisma: PrismaService, tenantId: string) {
  if (!tenantId) {
    throw new Error("Security Violation: Tenant ID is required for scoped database operations");
  }

  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }: any) {
          if ("tenantId" in (prisma as any)[model].fields) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async findFirst({ model, args, query }: any) {
          if ("tenantId" in (prisma as any)[model].fields) {
            args.where = { ...args.where, tenantId };
          }
          return query(args);
        },
        async create({ model, args, query }: any) {
          if ("tenantId" in (prisma as any)[model].fields) {
            if (args.data.tenantId && args.data.tenantId !== tenantId) {
              throw new Error(`Cross-Tenant Write Violation: Provided tenantId does not match session`);
            }
            args.data.tenantId = tenantId;
          }
          return query(args);
        },
      },
    },
  });
}
