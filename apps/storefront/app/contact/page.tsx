import type { Metadata } from 'next';
import { ContactForm } from '../../components/contact-form';

export const metadata: Metadata = {
  title: 'تماس با ما | دکتر درمر | Dr. Dermer UK Clinical Laboratories',
  description:
    'راه‌های ارتباط با لابراتوارهای تخصصی دکتر درمر (Dr. Dermer UK): مشاوره بالینی ۰۲۱-۸۸۸۸۰۰۰۰، تماس بین‌الملل +905313180690، ایمیل info@drdermer.co.uk، مراکز کمبریج (Cambridge Science Park, UK) و استانبول (Dumankaya Ikon Towers).',
};

const CONTACT_CARDS = [
  {
    icon: '📞',
    title: 'تلفن و مشاوره بالینی',
    lines: [
      { text: 'مشاوره بالینی: ۰۲۱-۸۸۸۸۰۰۰۰', href: 'tel:02188880000', ltr: true },
      { text: 'تماس بین‌الملل: +905313180690', href: 'tel:+905313180690', ltr: true },
    ],
  },
  {
    icon: '✉️',
    title: 'ایمیل رسمی و مکاتبات علمی',
    lines: [
      { text: 'info@drdermer.co.uk', href: 'mailto:info@drdermer.co.uk', ltr: true },
      { text: 'دپارتمان علمی، پروتکل‌های بالینی و امور کلینیک‌ها' },
    ],
  },
  {
    icon: '🏢',
    title: 'دفتر مرکزی و هماهنگی توزیع',
    lines: [
      { text: 'Dumankaya Ikon Towers, floor 34, No:370, Atasehir/Istanbul', ltr: true },
      { text: 'امور بازرگانی بین‌الملل، پشتیبانی اداری و هماهنگی توزیع' },
    ],
  },
  {
    icon: '🔬',
    title: 'مرکز تحقیقات انگلستان',
    lines: [
      { text: 'Cambridge Science Park, UK', ltr: true },
      { text: 'Cambridge CB4 0GF, Milton Rd, United Kingdom', ltr: true },
      { text: 'لابراتوارهای پژوهشی، فرمولاسیون ترنس‌درمال و کنترل کیفی بالینی' },
    ],
  },
] as const;

export default function ContactPage() {
  return (
    <section className="static-layout">
      <header className="static-header">
        <div className="eyebrow">دکتر درمر | Dr. Dermer UK Clinical Laboratories</div>
        <h1>ارتباط با لابراتوارهای تخصصی دکتر درمر</h1>
        <p>
          جهت دریافت مشاوره در خصوص پروتکل‌های درمانی، خرید تجهیزات و محصولات کلینیکال، استعلام اصالت کالا و کد TTAC، یا هماهنگی ارسال زنجیره سرد با کارشناسان ما در تماس باشید.
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
                    <span dir={'ltr' in line && line.ltr ? 'ltr' : undefined}>{line.text}</span>
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
