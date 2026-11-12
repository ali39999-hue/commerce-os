'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { validateNationalId, validateIranianMobile, toAsciiDigits } from '@commerce-os/localization';
import { toast } from 'sonner';

export interface KycData {
  fullName: string;
  phone: string;
  nationalCode: string;
  verifiedAt: string;
}

interface KycContextType {
  isKycVerified: boolean;
  kycData: KycData | null;
  verifyKyc: (data: { fullName: string; phone: string; nationalCode: string }) => { success: boolean; message?: string };
  resetKyc: () => void;
  isKycModalOpen: boolean;
  openKycModal: (redirectOnSuccess?: string) => void;
  closeKycModal: () => void;
  pendingRedirectUrl: string | null;
}

const KYC_STORAGE_KEY = 'customer_kyc_data';
const KYC_STATUS_KEY = 'customer_kyc_status';

const KycContext = createContext<KycContextType | null>(null);

export function KycProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isKycVerified, setIsKycVerified] = useState<boolean>(false);
  const [kycData, setKycData] = useState<KycData | null>(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState<boolean>(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);

  // Initialize KYC status on client mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(KYC_STORAGE_KEY);
      const storedStatus = localStorage.getItem(KYC_STATUS_KEY);

      if (storedData && storedStatus === 'VERIFIED') {
        const parsed = JSON.parse(storedData) as KycData;
        const cleanNational = toAsciiDigits(parsed.nationalCode || '').replace(/\D/g, '');
        if (cleanNational && validateNationalId(cleanNational)) {
          setKycData(parsed);
          setIsKycVerified(true);
          return;
        }
      }

      // Check existing user_profile if nationalCode was previously validated
      const userProfileRaw = localStorage.getItem('user_profile') || localStorage.getItem('dermer_account_profile');
      if (userProfileRaw) {
        try {
          const userProf = JSON.parse(userProfileRaw);
          const cleanNational = toAsciiDigits(userProf.nationalCode || '').replace(/\D/g, '');
          if (cleanNational && validateNationalId(cleanNational)) {
            const reconstructed: KycData = {
              fullName: userProf.fullName || 'کاربر گرامی',
              phone: userProf.phone || '',
              nationalCode: cleanNational,
              verifiedAt: new Date().toISOString(),
            };
            setKycData(reconstructed);
            setIsKycVerified(true);
            localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(reconstructed));
            localStorage.setItem(KYC_STATUS_KEY, 'VERIFIED');
            return;
          }
        } catch {
          // ignore corrupted JSON
        }
      }

      setIsKycVerified(false);
      setKycData(null);
    } catch {
      setIsKycVerified(false);
      setKycData(null);
    }
  }, []);

  const openKycModal = useCallback((redirectOnSuccess?: string) => {
    setPendingRedirectUrl(redirectOnSuccess || null);
    setIsKycModalOpen(true);
  }, []);

  const closeKycModal = useCallback(() => {
    setIsKycModalOpen(false);
    setPendingRedirectUrl(null);
  }, []);

  const verifyKyc = useCallback(
    (data: { fullName: string; phone: string; nationalCode: string }) => {
      const trimmedName = data.fullName.trim();
      if (!trimmedName || trimmedName.length < 3) {
        return { success: false, message: 'لطفاً نام و نام خانوادگی کامل خود را وارد کنید.' };
      }

      const cleanPhone = toAsciiDigits(data.phone.trim()).replace(/\D/g, '');
      if (!cleanPhone || !validateIranianMobile(cleanPhone)) {
        return { success: false, message: 'شماره تلفن همراه وارد شده نامعتبر است (مثال: ۰۹۱۲۳۴۵۶۷۸۹).' };
      }

      const cleanNational = toAsciiDigits(data.nationalCode.trim()).replace(/\D/g, '');
      if (!cleanNational || !validateNationalId(cleanNational)) {
        return { success: false, message: 'کد ملی ۱۰ رقمی وارد شده نامعتبر است (کنترل‌رقم با الگوریتم ثبت‌احوال همخوانی ندارد).' };
      }

      const record: KycData = {
        fullName: trimmedName,
        phone: cleanPhone,
        nationalCode: cleanNational,
        verifiedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(record));
        localStorage.setItem(KYC_STATUS_KEY, 'VERIFIED');

        // Also sync with user_profile for account & checkout continuity
        const existingProfile = localStorage.getItem('user_profile');
        const profileObj = existingProfile ? JSON.parse(existingProfile) : {};
        localStorage.setItem(
          'user_profile',
          JSON.stringify({
            ...profileObj,
            fullName: trimmedName,
            phone: cleanPhone,
            nationalCode: cleanNational,
          })
        );
      } catch (err) {
        console.error('Failed to save KYC status in localStorage', err);
      }

      setKycData(record);
      setIsKycVerified(true);
      toast.success('احراز هویت شما با موفقیت تأیید شد!');

      const redirect = pendingRedirectUrl;
      closeKycModal();

      if (redirect) {
        router.push(redirect);
      }

      return { success: true };
    },
    [pendingRedirectUrl, closeKycModal, router]
  );

  const resetKyc = useCallback(() => {
    try {
      localStorage.removeItem(KYC_STORAGE_KEY);
      localStorage.removeItem(KYC_STATUS_KEY);
    } catch {
      // ignore
    }
    setKycData(null);
    setIsKycVerified(false);
    toast.info('وضعیت احراز هویت ریست شد.');
  }, []);

  const value = useMemo(
    () => ({
      isKycVerified,
      kycData,
      verifyKyc,
      resetKyc,
      isKycModalOpen,
      openKycModal,
      closeKycModal,
      pendingRedirectUrl,
    }),
    [
      isKycVerified,
      kycData,
      verifyKyc,
      resetKyc,
      isKycModalOpen,
      openKycModal,
      closeKycModal,
      pendingRedirectUrl,
    ]
  );

  return <KycContext.Provider value={value}>{children}</KycContext.Provider>;
}

export function useKyc(): KycContextType {
  const ctx = useContext(KycContext);
  if (!ctx) {
    throw new Error('useKyc must be used within a KycProvider');
  }
  return ctx;
}
