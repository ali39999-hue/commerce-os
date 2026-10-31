import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="clinical-footer" role="contentinfo">
      <div className="footer-top">
        <div className="footer-grid">
          {/* Brand & Laboratory Bio */}
          <div className="footer-col brand-col">
            <div className="footer-brand-title">
              <span className="brand-logo-txt">DR. DERMER</span>
              <span className="brand-badge-pill">UK CLINICAL LABS</span>
            </div>
            <p className="footer-bio">
              آزمایشگاه‌های پژوهشی دکتر درمر انگلستان، پیشگام درمان‌های ترابافتی بدون تهاجم و توسعه سیستم‌های
              کربوکسی‌تراپی CO2 (Bohr Effect). ارائه‌دهنده پروتکل‌های اختصاصی ReeSkin و ReeMed برای متخصصین پوست،
              کلینیک‌های زیبایی و مراقبت خانگی درجه درمانی.
            </p>
            <div className="footer-contacts">
              <div className="contact-row">
                <span className="contact-icon" aria-hidden="true">📍</span>
                <span>تهران، خیابان ولیعصر، بالاتر از ظفر، مجتمع بین‌المللی پزشکی درمر، طبقه ۵</span>
              </div>
              <div className="contact-row">
                <span className="contact-icon" aria-hidden="true">📞</span>
                <span>تلفن مشاوره و پشتیبانی نسخه: <strong dir="ltr">۰۲۱-۸۸۸۸۰۰۰۰</strong></span>
              </div>
              <div className="contact-row">
                <span className="contact-icon" aria-hidden="true">⚡</span>
                <span>مرکز ثبت عوارض ناخواسته (فارماکوویژلانس ۲۴/۷): <strong dir="ltr">۰۲۱-۸۸۸۸۰۰۰۱</strong></span>
              </div>
            </div>
          </div>

          {/* Links Column 1: Product Lines */}
          <div className="footer-col">
            <h4 className="footer-heading">خانواده محصولات</h4>
            <ul className="footer-links">
              <li><Link href="/#brands">کیت‌های خانگی ReeSkin</Link></li>
              <li><Link href="/#brands">تجهیزات و ژل‌های کلینیکال ReeMed</Link></li>
              <li><Link href="/#concerns">پروتکل کربوکسی‌ژل CO2 ترابافتی</Link></li>
              <li><Link href="/#concerns">سرم‌های پپتیدی و فاکتور رشد (EGF)</Link></li>
              <li><Link href="/#concerns">بازسازی سد دفاعی و سرامید NP</Link></li>
              <li><Link href="/subscriptions">اشتراک دوره‌ای ترمیم و پروتکل‌ها</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Academy & Science */}
          <div className="footer-col">
            <h4 className="footer-heading">دانش و آکادمی بالینی</h4>
            <ul className="footer-links">
              <li><Link href="/#science">مکانیزم اثر بوهر (Bohr Effect)</Link></li>
              <li><Link href="/#clinical-results">نتایج کارآزمایی‌های بالینی</Link></li>
              <li><Link href="/#academy">پروتکل طلایی ۷ روزه بازسازی</Link></li>
              <li><Link href="/blog">ژورنال مقالات درماتولوژی</Link></li>
              <li><Link href="/b2b">دوره‌های مهارتی ویژه بیوتی‌تراپیست‌ها</Link></li>
              <li><Link href="/faq">پرسش‌های متداول درماتولوژی</Link></li>
            </ul>
          </div>

          {/* Links Column 3: Trust & Licensing */}
          <div className="footer-col">
            <h4 className="footer-heading">پورتال و مجوزهای قانونی</h4>
            <ul className="footer-links">
              <li><Link href="/b2b">پورتال خرید عمده کلینیک‌ها (فاکتور رسمی)</Link></li>
              <li><Link href="/account">داشبورد و رهگیری سفارشات</Link></li>
              <li><Link href="/legal">شرایط خدمات، اصالت و حریم خصوصی</Link></li>
              <li><Link href="/about">درباره سیستم یکپارچه Commerce OS</Link></li>
              <li><Link href="/contact">درخواست نمایندگی استانی و کلینیکی</Link></li>
            </ul>

            <div className="trust-badges-container">
              <div className="trust-badge-card" title="نماد اعتماد الکترونیکی (اینماد)">
                <span className="badge-initial">اینماد</span>
                <span className="badge-meta">کسب‌وکار ۵ ستاره</span>
              </div>
              <div className="trust-badge-card" title="نشان ملی ثبت رسانه‌های دیجیتال (ساماندهی)">
                <span className="badge-initial">ساماندهی</span>
                <span className="badge-meta">احراز هویت طلایی</span>
              </div>
              <div className="trust-badge-card" title="تاییدیه سلامت و اصالت ملزومات وزارت بهداشت">
                <span className="badge-initial">TTAC</span>
                <span className="badge-meta">اصالت دارو و کالا</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacovigilance & Medical Disclaimer */}
      <div className="footer-disclaimer-band">
        <div className="disclaimer-inner">
          <div className="disclaimer-box">
            <div className="disclaimer-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <strong>بیانیه سلب مسئولیت پزشکی و پروتکل فارماکوویژلانس (Pharmacovigilance)</strong>
            </div>
            <p>
              اطلاعات علمی، سازوکار مواد مؤثره و راهنماهای منتشرشده در پلتفرم دکتر درمر صرفاً جنبه آموزشی و آگاهی‌بخشی داشته و
              هرگز نباید جایگزین معاینه، تشخیص بالینی، تجویز دارو یا مشاوره مستقیم با پزشک متخصص پوست و مو تلقی شوند.
              پیش از شروع هرگونه پروتکل درمانی با اسیدهای میوه، کربوکسی‌تراپی، رتینوئیدها یا لایه‌بردارهای تخصصی، انجام تست
              حساسیت پوستی و بررسی عدم کنترااندیکاسیون الزامی است. در صورت بروز هرگونه واکنش آلرژیک غیرمنتظره، مصرف محصول را
              متوقف کرده و مراتب را سریعاً با سامانه ملی عوارض ناخواسته دارویی یا خط شبانه‌روزی ۰۲۱-۸۸۸۸۰۰۰۱ گزارش فرمایید.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="bottom-inner">
          <div className="copyright-text">
            <span>© ۲۰۲۶ پلتفرم دکتر درمر (Dr Dermer). تمامی حقوق مادی و معنوی محفوظ است.</span>
            <span className="tech-credit">پایه‌گذاری‌شده بر هسته یکپارچه Commerce OS · تراکنش‌های مالی صددرصد حسابداری دوطرفه و امن</span>
          </div>
          <div className="bottom-links">
            <Link href="/legal">حریم خصوصی</Link>
            <span className="sep">•</span>
            <Link href="/legal">شرایط ضمانت اصالت</Link>
            <span className="sep">•</span>
            <Link href="/faq">راهنمای ثبت سفارش</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
