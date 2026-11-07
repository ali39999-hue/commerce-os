import { ServiceUnavailableException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PrismaService } from '../database/prisma.service';

describe('SettingsService storefront overrides', () => {
  let findUnique: jest.Mock;
  let upsert: jest.Mock;
  let deleteMany: jest.Mock;
  let service: SettingsService;

  beforeEach(() => {
    findUnique = jest.fn();
    upsert = jest.fn();
    deleteMany = jest.fn();
    const prisma = {
      storefrontSetting: { findUnique, upsert, deleteMany },
    } as unknown as PrismaService;
    service = new SettingsService(prisma);
  });

  describe('getStorefrontOverrides', () => {
    it('returns stored overrides with source DB when the row exists', async () => {
      findUnique.mockResolvedValue({
        id: 'row-1',
        key: 'home_sections',
        payload: { overrides: { hero: false, bestsellers: true } },
        updatedBy: 'admin-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await service.getStorefrontOverrides();

      expect(findUnique).toHaveBeenCalledWith({ where: { key: 'home_sections' } });
      expect(res).toEqual({ overrides: { hero: false, bestsellers: true }, source: 'DB' });
    });

    it('returns empty defaults with source DEFAULT when the DB is down (never 500)', async () => {
      findUnique.mockRejectedValue(new Error('Connection refused'));

      const res = await service.getStorefrontOverrides();

      expect(res).toEqual({ overrides: {}, source: 'DEFAULT' });
    });

    it('returns defaults when the stored payload is malformed', async () => {
      findUnique.mockResolvedValue({ payload: { overrides: 'not-a-map' } });

      const res = await service.getStorefrontOverrides();

      expect(res).toEqual({ overrides: {}, source: 'DEFAULT' });
    });
  });

  describe('saveHomeSections', () => {
    it('upserts the row and merges incoming flags over the stored payload', async () => {
      findUnique.mockResolvedValue({
        payload: { overrides: { hero: true, bestsellers: true } },
      });
      upsert.mockResolvedValue({});

      const res = await service.saveHomeSections({ bestsellers: false, faq: true }, 'admin-9');

      expect(upsert).toHaveBeenCalledWith({
        where: { key: 'home_sections' },
        update: {
          payload: { overrides: { hero: true, bestsellers: false, faq: true } },
          updatedBy: 'admin-9',
        },
        create: {
          key: 'home_sections',
          payload: { overrides: { hero: true, bestsellers: false, faq: true } },
          updatedBy: 'admin-9',
        },
      });
      expect(res).toEqual({
        saved: true,
        overrides: { hero: true, bestsellers: false, faq: true },
      });
    });

    it('refuses with honest 503 when the DB is down (no fake saved state)', async () => {
      findUnique.mockRejectedValue(new Error('Connection refused'));

      await expect(service.saveHomeSections({ hero: true })).rejects.toThrow(
        ServiceUnavailableException,
      );
      expect(upsert).not.toHaveBeenCalled();
    });
  });

  describe('resetHomeSections', () => {
    it('deletes the row and resolves to empty overrides', async () => {
      deleteMany.mockResolvedValue({ count: 1 });

      const res = await service.resetHomeSections();

      expect(deleteMany).toHaveBeenCalledWith({ where: { key: 'home_sections' } });
      expect(res).toEqual({ saved: true, overrides: {} });
    });
  });
});
