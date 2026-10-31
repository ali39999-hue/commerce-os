import type { Metadata } from 'next';
import { ContactForm } from '../../components/contact-form';

export const metadata: Metadata = {
  title: 'تماس با ما | پشتیبانی بازارک',
  description:
    'راه‌های ارتباط با تیم پشتیبانی بازارک: تلفن ۰۲۱-۸۸۸۸۸۸۸۸، ایمیل support@commerce-os.local و آدرس دفتر تهران؛ پاسخ‌گویی همه‌روزه از ساعت ۹ تا ۱۸.',
};

const CONTACT_CARDS = [
  {
    icon: '📞',
    title: 'تلفن پشتیبانی',
    lines: [
      { text: '۰۲۱-۸۸۸۸۸۸۸۸' },
      { text: 'داخلی ۲: سفارش‌ها و ارسال · داخلی ۳: مالی و بازگشت وجه' },
    ],
  },
  {
    icon: '✉️',
    title: 'ایمیل',
    lines: [
      { text: 'support@commerce-os.local', href: 'mailto:support@commerce-os.local', ltr: true },
      { text: 'پاسخ حداکثر تا یک روز کاری' },
    ],
  },
  {
    icon: '🏢',
    title: 'دفتر مرکزی',
    lines: [{ text: 'تهران، خیابان ولی‌عصر، بالاتر از پارک ساعی، پلاک ۱۲، طبقه سوم' }],
  },
  {
    icon: '🕘',
    title: 'ساعت پاسخ‌گویی',
    lines: [{ text: 'شنبه تا پنجشنبه، ۹ صبح تا ۶ عصر · جمعه‌ها فقط پیام‌های آنلاین' }],
  },
] as const;

export default function ContactPage() {
  return (
    <section className="static-layout">
      <header className="static-header">
        <div className="eyebrow">ارتباط با ما</div>
        <h1>تماس با ما</h1>
        <p>
          هر سوالی درباره سفارش، ارسال یا پرداخت دارید، از هر یک از راه‌های زیر با ما در تماس باشید؛
          پاسخگویی ما واقعی و انسانی است.
        </p>
      </header>

      <div className="contact-grid">
        {CONTACT_CARDS.map((card) => (
          <div className="contact-card" key={card.title}>
            <span className="contact-icon" aria-hidden="true">{card.icon}</span>
            <div>
              <h3>{card.title}</h3>
              {card.lines.map((line) => (
                <p key={line.text}>
                  {'href' in line && line.href ? (
                    <a href={line.href} dir={line.ltr ? 'ltr' : undefined}>
                      {line.text}
                    </a>
                  ) : (
                    line.text
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ContactForm />
    </section>
  );
}
