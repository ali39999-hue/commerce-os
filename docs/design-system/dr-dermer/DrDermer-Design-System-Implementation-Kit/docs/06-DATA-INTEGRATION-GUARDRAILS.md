# Data & Integration Guardrails
- UI redesign معنای domain را تغییر ندهد.
- قیمت و موجودی server-authoritative باشند.
- وضعیت پرداخت در سرور تأیید شود؛ callback مرورگر به‌تنهایی کافی نیست.
- refund، finance و inventory نیازمند permission و audit باشند.
- اسناد حرفه‌ای با دسترسی محدود محافظت شوند.
- entitlement دوره و گواهی سمت سرور کنترل شود.
- UI permission gate جایگزین authorization سمت سرور نیست.
- تغییر API/schema فقط با contract، migration plan و approval.
