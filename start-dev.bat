@echo off
chcp 65001 >nul
echo ========================================================
echo   🛍️  Commerce OS — راه اندازی محیط لوکال هاست (نسخه کامل)
echo ========================================================
echo.

echo 1. در حال بررسی وابستگی ها...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo خطایی در نصب وابستگی ها رخ داد.
    pause
    exit /b %ERRORLEVEL%
)

echo 2. در حال ساخت پکیج های مشترک...
call pnpm -r --filter "./packages/*" run build

echo 3. در حال ایجاد کلاینت پریزما...
call pnpm --filter @commerce-os/api run db:generate

echo 4. در حال راه اندازی پایگاه داده جاسازی شده (PGlite PostgreSQL 17)...
start "Commerce OS - Embedded DB" /B node scripts/embedded-postgres.mjs
timeout /t 3 >nul

echo 5. اعمال سید اولیه داده ها...
call pnpm --filter @commerce-os/api run db:seed

echo.
echo ========================================================
echo   ✅ تمامی سرویس های Commerce OS در حال اجرا هستند:
echo      - ویترین فروشگاه:  http://localhost:3000
echo      - پنل مدیریت ERP: http://localhost:3001
echo      - هسته API:        http://localhost:4000/v1
echo      - پایگاه داده:    127.0.0.1:5432 (PostgreSQL 17)
echo ========================================================
echo.
echo در حال اجرای همزمان تمام سرویس ها با Turbo...
call pnpm dev
pause
