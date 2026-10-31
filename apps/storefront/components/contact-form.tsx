'use client';

import { useState } from 'react';

type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
};

const STORAGE_KEY = 'commerce-os-contact-submissions';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setSuccess(false);
      setError('لطفاً هر سه فیلد را کامل کنید.');
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? (parsed as ContactSubmission[]) : [];
      list.push({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        submittedAt: new Date().toISOString(),
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // اگر localStorage در دسترس نبود، ارسال نمایشی را متوقف نمی‌کنیم.
    }

    setError(null);
    setSuccess(true);
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <form className="review-form contact-demo-form" onSubmit={handleSubmit} noValidate>
      <h3>فرم تماس (نسخه نمایشی)</h3>
      <p style={{ margin: 0, color: 'var(--muted)', fontSize: '.85rem' }}>
        پیام شما در همین مرورگر ذخیره می‌شود و در نسخه نمایشی جایی ارسال نمی‌گردد.
      </p>

      {error ? (
        <p className="error-banner" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="success-banner" role="status">
          ✓ پیام شما ثبت شد. کارشناسان ما در ساعات پاسخ‌گویی (۹ تا ۱۸) با شما تماس می‌گیرند.
        </p>
      ) : null}

      <label className="form-field">
        نام و نام خانوادگی
        <input
          className="input-text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="مثلاً سارا محمدی"
          autoComplete="name"
        />
      </label>

      <label className="form-field">
        ایمیل یا شماره تماس
        <input
          className="input-text"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@mail.com"
          autoComplete="email"
          dir="ltr"
        />
      </label>

      <label className="form-field">
        متن پیام
        <textarea
          className="input-textarea"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="سؤال یا درخواست خود را بنویسید..."
        />
      </label>

      <button type="submit" className="btn-submit-order">
        ارسال پیام
      </button>
    </form>
  );
}
