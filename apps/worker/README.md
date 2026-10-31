# Worker boundary (not implemented yet)

این پوشه فعلاً کد اجرایی ندارد تا worker خالی به‌اشتباه deploy نشود. در W3/W5 باید job واقعی برای انقضای inventory reservation و Outbox ساخته شود. هر handler باید retry محدود، backoff، idempotency، dead-letter و test واقعی داشته باشد. تا قبل از آن Redis صرفاً در compose توسعه موجود است.
