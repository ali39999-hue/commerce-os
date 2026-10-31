import Link from 'next/link';

export default function NotFound() {
  return <main className="page-shell"><header className="site-header"><Link className="brand" href="/">بازارک <span>COMMERCE OS</span></Link></header><section className="state-panel"><div className="eyebrow">404</div><h1>این کالا پیدا نشد</h1><p>ممکن است کالا منتشر نشده باشد یا مسیر آن تغییر کرده باشد.</p><Link className="primary-link" href="/">بازگشت به فروشگاه</Link></section></main>;
}
