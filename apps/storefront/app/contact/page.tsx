import type { Metadata } from 'next';
import Link from 'next/link';
import ContactMap from '../../components/contact-map';
import { ContactForm } from '../../components/contact-form';
import { Navigation, Clock, ShieldCheck, Truck } from 'lucide-react';
import './contact.css';

export const metadata: Metadata = {
  title: 'تماس با ما | دفتر مرکزی و پشتیبانی مشتریان',
  description:
    'راه‌های ارتباط با پشتیبانی و دفتر مرکزی: تلفن ۰۲۱۹۲۰۰۵۲۲۱ - ۰۲۱۹۱۴۲۰۰۵۰۰، ایمیل پشتیبانی support@khanoumi.com، نشانی تهران، خیابان ولیعصر، قبل از تقاطع نیایش، نبش خیابان ناصری، ساختمان کیان.',
};

export default function ContactPage() {
  return (
    <div className="contact-page-wrapper">
      {/* Breadcrumbs Navigation */}
      <nav className="contact-breadcrumbs" aria-label="مسیر صفحه">
        <Link href="/">صفحه اصلی</Link>
        <span className="separator">/</span>
        <span className="current">تماس با ما</span>
      </nav>

      {/* Main Split Contact Card */}
      <div className="contact-main-card">
        {/* Left Column: Interactive Map */}
        <div className="contact-map-col">
          <div className="contact-map-frame">
            <ContactMap
              latitude={35.7724}
              longitude={51.4181}
              zoom={16}
              title="ساختمان کیان (دفتر مرکزی)"
              address="تهران، خیابان ولیعصر، قبل از تقاطع نیایش، نبش خیابان ناصری، ساختمان کیان (پلاک ۲۵۵۱)"
            />
          </div>

          {/* Quick Route Navigation Apps */}
          <div className="contact-nav-apps">
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
              مسیریابی سریع:
            </span>
            <a
              href="https://neshan.org/maps/@35.7724,51.4181,16z"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-nav-btn"
            >
              <Navigation size={13} />
              <span>مسیریابی با نشان</span>
            </a>
            <a
              href="https://balad.ir/location?latitude=35.7724&longitude=51.4181"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-nav-btn"
            >
              <Navigation size={13} />
              <span>مسیریابی با بلد</span>
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=35.7724,51.4181"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-nav-btn"
            >
              <Navigation size={13} />
              <span>Google Maps</span>
            </a>
          </div>
        </div>

        {/* Right Column: Contact Details (Khanoumi Reference) */}
        <div className="contact-details-col">
          <h1 className="contact-heading">تماس با ما</h1>
          <p className="contact-tagline">
            شما می‌توانید از روش‌های زیر با ما در ارتباط باشید:
          </p>

          <div className="contact-info-list">
            {/* Phone */}
            <div className="contact-info-row">
              <span className="contact-info-label">تلفن:</span>
              <span className="contact-info-value" dir="ltr">
                <a href="tel:02192005221">۰۲۱۹۲۰۰۵۲۲۱</a> -{' '}
                <a href="tel:021914200500">۰۲۱۹۱۴۲۰۰۵۰۰</a>
              </span>
            </div>

            {/* Support Email */}
            <div className="contact-info-row">
              <span className="contact-info-label">ایمیل پشتیبانی:</span>
              <span className="contact-info-value" dir="ltr">
                <a href="mailto:support@khanoumi.com">support@khanoumi.com</a>
              </span>
            </div>

            {/* General Email */}
            <div className="contact-info-row">
              <span className="contact-info-label">ایمیل:</span>
              <span className="contact-info-value" dir="ltr">
                <a href="mailto:info@khanoumi.com">info@khanoumi.com</a>
              </span>
            </div>

            {/* Postal Code */}
            <div className="contact-info-row">
              <span className="contact-info-label">کد پستی:</span>
              <span className="contact-info-value" dir="ltr">
                ۱۹۶۸۶۴۳۱۳۴
              </span>
            </div>

            {/* Physical Address */}
            <div className="contact-info-row address-row">
              <span className="contact-info-label">آدرس:</span>
              <span className="contact-info-value">
                تهران، خیابان ولیعصر، قبل از تقاطع نیایش، نبش خیابان ناصری، ساختمان کیان (پلاک ۲۵۵۱)، طبقه شانزده، دفتر مرکزی
              </span>
            </div>
          </div>

          {/* Order Tracking Callout */}
          <div className="contact-tracking-callout">
            <span>برای پیگیری سفارش </span>
            <Link href="/account?tab=orders" className="contact-link-highlight">
              اینجا
            </Link>
            <span> کلیک کنید.</span>
          </div>
        </div>
      </div>

      {/* Supporting Hours & Guarantees Strip */}
      <div className="contact-hours-strip">
        <div className="contact-hour-item">
          <div className="contact-hour-icon">
            <Clock size={20} />
          </div>
          <div className="contact-hour-content">
            <strong>ساعات پاسخگویی تلفنی</strong>
            <span>شنبه تا چهارشنبه ۹:۰۰ الی ۱۸:۰۰ | پنجشنبه‌ها ۹:۰۰ الی ۱۴:۰۰</span>
          </div>
        </div>

        <div className="contact-hour-item">
          <div className="contact-hour-icon">
            <ShieldCheck size={20} />
          </div>
          <div className="contact-hour-content">
            <strong>پشتیبانی آنلاین و تیکت‌ها</strong>
            <span>۷ روز هفته به صورت ۲۴ ساعته در پنل کاربری</span>
          </div>
        </div>

        <div className="contact-hour-item">
          <div className="contact-hour-icon">
            <Truck size={20} />
          </div>
          <div className="contact-hour-content">
            <strong>ارسال و توزیع سراسری</strong>
            <span>پست پیشتاز مجهز به زنجیره سرد و پیک اختصاصی</span>
          </div>
        </div>
      </div>

      {/* Online Message / Ticket Form */}
      <div className="contact-form-section">
        <div className="contact-form-header">
          <h2>ارسال پیام و استعلام آنلاین</h2>
          <p>
            کارشناسان ما در سریع‌ترین زمان ممکن به پیام‌ها و سوالات شما پاسخ خواهند داد.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
