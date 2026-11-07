import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="static-layout">
      <div className="state-panel" style={{ padding: '60px 24px', margin: '20px auto' }}>
        <div className="eyebrow" style={{ color: 'var(--brand)', fontWeight: 800, marginBottom: '12px' }}>
          ۴۰۴ | DR. DERMER UK CLINICAL LABORATORIES
        </div>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--brand-deep)', margin: '0 0 16px' }}>
          صفحه یا فرآورده بالینی مورد نظر یافت نشد
        </h1>
        <p style={{ maxWidth: '540px', margin: '0 auto 24px', color: 'var(--muted)', lineHeight: '1.9' }}>
          نشانی درخواست‌شده در پورتال رسمی دکتر درمر موجود نمی‌باشد. ممکن است پیوند تغییر یافته باشد یا فرآورده مورد نظر در کاتالوگ جاری بالینی در دسترس نباشد.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="primary-link" href="/">
            بازگشت به صفحه اصلی
          </Link>
          <Link
            className="secondary-link"
            href="/carboxygel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--brand-deep)',
              fontWeight: 700,
              fontSize: '.9rem',
              textDecoration: 'none',
            }}
          >
            مشاهده محصول CarboxyGel
          </Link>
          <Link
            className="secondary-link"
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--brand-deep)',
              fontWeight: 700,
              fontSize: '.9rem',
              textDecoration: 'none',
            }}
          >
            ارتباط با واحد بالینی
          </Link>
        </div>
      </div>
    </section>
  );
}
