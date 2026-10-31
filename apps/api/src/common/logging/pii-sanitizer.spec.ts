import { maskPii, sanitizeLogObject } from './pii-sanitizer';

describe('pii-sanitizer', () => {
  it('masks 16-digit bank card numbers', () => {
    expect(maskPii('Payment failed for card 6037991812345678')).toBe(
      'Payment failed for card 6037-****-****-5678',
    );
    expect(maskPii('Dashed card 6219-8610-1234-5678 in log')).toBe(
      'Dashed card 6219-****-****-5678 in log',
    );
  });

  it('masks Iranian mobile phone numbers in various formats', () => {
    expect(maskPii('User 09123456789 requested OTP')).toBe(
      'User 0912***6789 requested OTP',
    );
    expect(maskPii('Intl +989351234567 requested OTP')).toBe(
      'Intl +98935***4567 requested OTP',
    );
    expect(maskPii('Prefix 00989121234567 requested OTP')).toBe(
      'Prefix 0098912***4567 requested OTP',
    );
  });

  it('masks 10-digit national IDs without corrupting UUIDs or ISO dates', () => {
    expect(maskPii('National ID 0012345678 registered')).toBe(
      'National ID 001****678 registered',
    );
    expect(maskPii('Trace ID 123e4567-e89b-12d3-a456-426614174000 at 2026-10-31T12:00:00.000Z')).toBe(
      'Trace ID 123e4567-e89b-12d3-a456-426614174000 at 2026-10-31T12:00:00.000Z',
    );
  });

  it('redacts sensitive keys in objects', () => {
    const raw = {
      username: 'alice',
      password: 'my-super-secret-password',
      token: 'jwt.token.here',
      cardNumber: '6037991812345678',
      meta: {
        note: 'Customer phone is 09123456789',
      },
    };

    const sanitized = sanitizeLogObject(raw);
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.token).toBe('[REDACTED]');
    expect(sanitized.cardNumber).toBe('[REDACTED]');
    expect(sanitized.meta.note).toBe('Customer phone is 0912***6789');
  });
});
