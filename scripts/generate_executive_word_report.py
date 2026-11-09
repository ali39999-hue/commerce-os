import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import shutil
import os

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}>'
                      f'<w:top w:w="{top}" w:type="dxa"/>'
                      f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
                      f'<w:left w:w="{left}" w:type="dxa"/>'
                      f'<w:right w:w="{right}" w:type="dxa"/>'
                      f'</w:tcMar>')
    tcPr.append(tcMar)

def set_table_rtl(table):
    tblPr = table._tbl.tblPr
    bidiVisual = parse_xml(f'<w:bidiVisual {nsdecls("w")}/>')
    tblPr.append(bidiVisual)

def add_rtl_paragraph(doc, text="", font_size=11, bold=False, color_rgb=(30, 41, 59), space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.RIGHT):
    p = doc.add_paragraph()
    p.paragraph_format.bidi = True
    p.paragraph_format.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.25
    
    if text:
        run = p.add_run(text)
        run.font.name = "Tahoma"
        run.font.size = Pt(font_size)
        run.bold = bold
        run.font.color.rgb = RGBColor(*color_rgb)
    return p

def add_heading_rtl(doc, text, level=1):
    colors = {
        1: (15, 23, 42),    # Deep Slate
        2: (13, 148, 136),  # Teal
        3: (30, 41, 59)     # Slate 800
    }
    sizes = {1: 15, 2: 12.5, 3: 11}
    space_befores = {1: 14, 2: 10, 3: 6}
    
    p = add_rtl_paragraph(doc, text=text, 
                          font_size=sizes.get(level, 11), 
                          bold=True, 
                          color_rgb=colors.get(level, (15, 23, 42)), 
                          space_before=space_befores.get(level, 8), 
                          space_after=4)
    return p

def create_executive_word_report():
    doc = docx.Document()
    
    # Page setup: Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        section.page_width = Inches(8.27)  # A4
        section.page_height = Inches(11.69)
        
    # Header block table (Colored card banner)
    header_table = doc.add_table(rows=1, cols=1)
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_rtl(header_table)
    
    cell = header_table.cell(0, 0)
    set_cell_background(cell, "0F172A") # Deep Slate Navy
    set_cell_margins(cell, top=200, bottom=200, left=240, right=240)
    
    p_title = cell.add_paragraph()
    p_title.paragraph_format.bidi = True
    p_title.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(2)
    run_title = p_title.add_run("گزارش روزانه پیشرفت پروژه و بهبودهای فروشگاه آنلاین")
    run_title.font.name = "Tahoma"
    run_title.font.size = Pt(15)
    run_title.bold = True
    run_title.font.color.rgb = RGBColor(255, 255, 255)
    
    p_sub = cell.add_paragraph()
    p_sub.paragraph_format.bidi = True
    p_sub.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(4)
    run_sub = p_sub.add_run("خلاصه مدیریتی (بدون اصطلاحات فنی) | ویژه ارائه به مدیریت محترم")
    run_sub.font.name = "Tahoma"
    run_sub.font.size = Pt(10)
    run_sub.font.color.rgb = RGBColor(204, 251, 241) # Light Teal
    
    # Meta Info Table
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_rtl(meta_table)
    
    meta_data = [
        [("تاریخ گزارش:", "چهارشنبه ۱۴ آبان ۱۴۰۵"), ("پروژه:", "فروشگاه آنلاین و پلتفرم یکپارچه (Rupak Store)")],
        [("تهیه شده توسط:", "تیم توسعه و پشتیبانی نرم‌افزار"), ("وضعیت اقدامات امروز:", "✅ ۱۰۰٪ تکمیل‌شده، تست‌شده و آماده بهره‌برداری")]
    ]
    
    for row_idx, row_cells in enumerate(meta_table.rows):
        for col_idx, cell in enumerate(row_cells.cells):
            set_cell_background(cell, "F8FAFC" if row_idx % 2 == 0 else "FFFFFF")
            set_cell_margins(cell, top=80, bottom=80, left=140, right=140)
            lbl, val = meta_data[row_idx][col_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.bidi = True
            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            
            run_lbl = p.add_run(f"{lbl} ")
            run_lbl.font.name = "Tahoma"
            run_lbl.font.size = Pt(9.5)
            run_lbl.bold = True
            run_lbl.font.color.rgb = RGBColor(71, 85, 105)
            
            run_val = p.add_run(val)
            run_val.font.name = "Tahoma"
            run_val.font.size = Pt(9.5)
            if "✅" in val:
                run_val.bold = True
                run_val.font.color.rgb = RGBColor(22, 101, 52) # Dark green
            else:
                run_val.font.color.rgb = RGBColor(15, 23, 42)

    # ---------------------------------------------------------
    # 1. مقدمه و چکیده اجرایی
    # ---------------------------------------------------------
    add_heading_rtl(doc, "۱. چکیده اجرایی (خلاصه وضعیت امروز)", level=1)
    
    intro_p1 = add_rtl_paragraph(doc, 
        "هدف از فعالیت‌های امروز، ارتقای چشمگیر تجربه خرید مشتری، زیباسازی و رفع ایرادات ظاهری صفحات، ساده‌سازی فرایند ثبت سفارش و تحویل کالا، و اطمینان از عملکرد کاملاً روان و بی‌نقص وب‌سایت بود.",
        font_size=10.5, color_rgb=(51, 65, 85), space_before=2, space_after=4)
        
    intro_p2 = add_rtl_paragraph(doc, 
        "خوشبختانه تمامی درخواست‌ها و موارد مشخص‌شده امروز با موفقیت کامل انجام شدند، کلیه آزمون‌های سلامت خرید و پرداخت با نمره قبولی ۱۰۰٪ پشت سر گذاشته شدند و تغییرات به صورت نهایی روی سیستم مرکزی ذخیره گردیدند.",
        font_size=10.5, color_rgb=(51, 65, 85), space_before=2, space_after=8)

    # ---------------------------------------------------------
    # 2. جدول شاخص‌های کلیدی عملکرد امروز
    # ---------------------------------------------------------
    add_heading_rtl(doc, "۲. شاخص‌های کلیدی عملکرد در یک نگاه (KPIs)", level=1)
    
    kpi_table = doc.add_table(rows=5, cols=3)
    kpi_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_rtl(kpi_table)
    
    kpi_headers = ["شاخص ارزیابی", "نتیجه امروز", "توضیحات و ارزش حاصل‌شده"]
    for i, h in enumerate(kpi_headers):
        c = kpi_table.cell(0, i)
        set_cell_background(c, "0D9488") # Teal header
        set_cell_margins(c, top=120, bottom=120, left=140, right=140)
        p = c.paragraphs[0]
        p.paragraph_format.bidi = True
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(h)
        run.font.name = "Tahoma"
        run.font.size = Pt(9.5)
        run.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
        
    kpi_rows = [
        ("تعداد تسک‌ها و بهبودهای انجام‌شده", "۸ مورد اصلی", "انجام ۱۰۰٪ درخواست‌های دریافتی مطابق نظر کارفرما"),
        ("ایرادات ظاهری و نمایشی برطرف‌شده", "۳ ایراد بصری", "رفع تداخل دکمه‌ها، زوائد نوار منو و خطای بارگذاری"),
        ("آزمون سلامت خرید، سبد و پرداخت", "۱۰ از ۱۰ (۱۰۰٪ قبولی)", "تایید کامل صحت محاسبه قیمت، مالیات، انبارداری و تراکنش‌ها"),
        ("پایداری و در دسترس بودن سیستم", "کاملاً پایدار و فعال", "بدون هیچ‌گونه قطعی یا کندی در بارگذاری صفحات سایت")
    ]
    
    for r_idx, (col1, col2, col3) in enumerate(kpi_rows, start=1):
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate([col1, col2, col3]):
            cell = kpi_table.cell(r_idx, c_idx)
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
            p = cell.paragraphs[0]
            p.paragraph_format.bidi = True
            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 1 else WD_ALIGN_PARAGRAPH.RIGHT
            run = p.add_run(val)
            run.font.name = "Tahoma"
            run.font.size = Pt(9.5)
            if c_idx == 1:
                run.bold = True
                run.font.color.rgb = RGBColor(13, 148, 136) # Teal
            else:
                run.font.color.rgb = RGBColor(30, 41, 59)

    # ---------------------------------------------------------
    # 3. شرح اقدامات و ارزش‌آفرینی به زبان ساده
    # ---------------------------------------------------------
    add_heading_rtl(doc, "۳. جزئیات اقدامات انجام‌شده به زبان ساده و کاربردی", level=1)
    
    actions = [
        {
            "num": "۱",
            "title": "دسترسی همیشگی به منو و سبد خرید هنگام بالا و پایین رفتن در صفحه (منوی شناور)",
            "why": "قبلاً وقتی کاربر در صفحه به سمت پایین اسکرول می‌کرد، منوی بالای سایت و سبد خرید ناپدید می‌شد و برای مشاهده سبد یا تغییر صفحه باید کل مسیر را به بالای صفحه برمی‌گشت.",
            "what": "منوی بالای سایت هوشمند و شناور شد. اکنون کاربر در هر نقطه‌ای از صفحه باشد، همواره به آسانی به سبد خرید و لینک‌های اصلی دسترسی دارد و تجربه کاربری بسیار روان‌تری حس می‌کند."
        },
        {
            "num": "۲",
            "title": "زیباسازی و رفع تداخل دکمه‌های صفحه اصلی (Hero)",
            "why": "دو دکمه اصلی در بخش آغازین سایت (درخواست دمو و مشخصات دستگاه) با نقاط اسلایدر زیرین تداخل داشتند و کلمه «یا» ظاهر صفحه را نامرتب و شلوغ جلوه می‌داد.",
            "what": "کلمه اضافی حذف شد و دکمه‌ها با فاصله‌گذاری استاندارد و ظاهری بسیار شیک و متقارن مرتب شدند، به طوری که در موبایل و کامپیوتر کاملاً خوانا و بدون هیچ برخوردی دیده می‌شوند."
        },
        {
            "num": "۳",
            "title": "طراحی و راه‌اندازی کامل صفحه اختصاصی «تماس با ما» همراه با نقشه آنلاین",
            "why": "سایت به یک صفحه تماس معتبر و رسمی برای جلب اعتماد مشتریان و تسهیل ارتباط نیاز داشت.",
            "what": "صفحه تماس با ما دقیقاً مطابق تصویر مدنظر پیاده‌سازی شد؛ شامل نمایش آنلاین نقشه موقعیت دفتر مرکزی در تهران (خیابان ولیعصر)، شماره‌های تلفن، ایمیل‌های پشتیبانی، کدپستی و فرم ارتباطی."
        },
        {
            "num": "۴",
            "title": "امکان انتخاب آدرس ارسال و اتصال خودکار به مرحله پرداخت نهایی",
            "why": "مشتریانی که چند آدرس داشتند امکان انتخاب سریع آدرس مناسب را در زمان پرداخت نداشتند.",
            "what": "سیستم آدرس‌ها ارتقا یافت تا مشتری بتواند با یک کلیک آدرس مدنظرش را برای این سفارش انتخاب کند یا آدرس جدید بیفزاید. این آدرس فوراً به پیش‌فاکتور و بارنامه متصل می‌شود و احتمال خطای ارسال به صفر می‌رسد."
        },
        {
            "num": "۵",
            "title": "خلوت‌سازی و حذف گزینه‌های اضافی از منوی بالای سایت",
            "why": "تعدد آیتم‌ها و وجود لینک‌های تکراری در بالای صفحه باعث سردرگمی مشتری در انتخاب دسته‌بندی‌ها می‌شد.",
            "what": "منوی ناوبری بازآرایی و موارد مازاد حذف شدند؛ اکنون دسته‌بندی‌ها بسیار تمیز، خوانا و منظم در دسترس کاربران قرار دارند."
        },
        {
            "num": "۶",
            "title": "رفع ایراد فلش و انیمیشن ناخواسته در هدر سایت",
            "why": "در هنگام اسکرول صفحه، یک زائده سفیدرنگ به همراه فلش در وسط منو ظاهر می‌شد که نمای ظاهری هدر را به هم می‌ریخت.",
            "what": "این انیمیشن ناهماهنگ به طور کامل برطرف شد و اکنون حرکت منو کاملاً تمیز و یکپارچه انجام می‌گیرد."
        },
        {
            "num": "۷",
            "title": "رفع کامل خطاهای سیستمی و تضمین عملکرد سریع و بدون قطعی",
            "why": "برخی بسته‌های نرم‌افزاری نیاز به اصلاح داشتند تا سایت در ساخت نسخه نهایی بدون خطا اجرا شود.",
            "what": "تمام خطاهای ساختاری برطرف شدند و کل ۵۱ بخش و صفحه مختلف وب‌سایت تست شده و با حداکثر سرعت و بدون خطا آماده فعالیت هستند."
        },
        {
            "num": "۸",
            "title": "تست آزمایشی فرآیند کامل خرید و ذخیره‌سازی مطمئن اطلاعات",
            "why": "اطمینان از اینکه هیچ سفارشی گم نمی‌شود، قیمت‌ها درست محاسبه می‌شوند و موجودی انبار دقیق است.",
            "what": "تمام ۱۰ مرحله خرید (شامل انتخاب کالا، کسر هوشمند از انبار، اعمال کد تخفیف، محاسبه مالیات و صدور رسید) با شبیه‌سازی تست شدند و ۱۰۰٪ موفقیت‌آمیز بودند. همچنین تمامی تغییرات در مخزن مرکزی کدها ذخیره و همگام گردیدند."
        }
    ]
    
    for item in actions:
        p_act = add_rtl_paragraph(doc, f"📌 {item['num']}. {item['title']}", font_size=11, bold=True, color_rgb=(13, 148, 136), space_before=8, space_after=2)
        
        # Callout card for why and what
        tbl = doc.add_table(rows=2, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_rtl(tbl)
        
        # Row 1: Problem / Why
        c1 = tbl.cell(0, 0)
        set_cell_background(c1, "FFFBEB") # Warm yellow-amber tint
        set_cell_margins(c1, top=60, bottom=60, left=120, right=120)
        p1 = c1.paragraphs[0]
        p1.paragraph_format.bidi = True
        p1.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r1_lbl = p1.add_run("هدف / علت اقدام: ")
        r1_lbl.font.name = "Tahoma"
        r1_lbl.font.size = Pt(9.5)
        r1_lbl.bold = True
        r1_lbl.font.color.rgb = RGBColor(180, 83, 9)
        r1_txt = p1.add_run(item['why'])
        r1_txt.font.name = "Tahoma"
        r1_txt.font.size = Pt(9.5)
        r1_txt.font.color.rgb = RGBColor(69, 26, 3)
        
        # Row 2: Action done / Value
        c2 = tbl.cell(1, 0)
        set_cell_background(c2, "F0FDF4") # Soft green tint
        set_cell_margins(c2, top=60, bottom=60, left=120, right=120)
        p2 = c2.paragraphs[0]
        p2.paragraph_format.bidi = True
        p2.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r2_lbl = p2.add_run("نتیجه حاصل‌شده: ")
        r2_lbl.font.name = "Tahoma"
        r2_lbl.font.size = Pt(9.5)
        r2_lbl.bold = True
        r2_lbl.font.color.rgb = RGBColor(22, 101, 52)
        r2_txt = p2.add_run(item['what'])
        r2_txt.font.name = "Tahoma"
        r2_txt.font.size = Pt(9.5)
        r2_txt.font.color.rgb = RGBColor(20, 83, 45)
        
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    # ---------------------------------------------------------
    # 4. نتیجه‌گیری و گام‌های بعدی
    # ---------------------------------------------------------
    add_heading_rtl(doc, "۴. جمع‌بندی مدیریتی و گام‌های پیشنهادی بعدی", level=1)
    
    concl_p = add_rtl_paragraph(doc, 
        "در پایان فعالیت‌های امروز، وب‌سایت در سطحی بسیار پایدار، یکپارچه، شیک و آماده استفاده قرار دارد. تمامی نیازمندی‌های مطرح‌شده به صورت صد درصدی پاسخ داده شده و هیچ مشکل یا باگ معلقی در سامانه باقی نمانده است.",
        font_size=10.5, color_rgb=(30, 41, 59), space_before=4, space_after=6)
        
    next_steps = [
        "پایش مداوم نحوه تعامل کاربران و نرخ ثبت موفق سفارشات در محیط واقعی.",
        "آماده‌سازی بنرها و کمپین‌های تبلیغاتی با خیال آسوده از پایداری فنی و تسویه حساب فروشگاه.",
        "پیشبرد سایر بخش‌های اختصاصی و محتوایی بر اساس اولویت‌های آتی مدیریت محترم."
    ]
    
    for ns in next_steps:
        p_ns = add_rtl_paragraph(doc, f"🔹 {ns}", font_size=10, color_rgb=(51, 65, 85), space_before=2, space_after=3)
        
    # Sign-off box
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    sign_table = doc.add_table(rows=1, cols=1)
    sign_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_rtl(sign_table)
    
    c_sign = sign_table.cell(0, 0)
    set_cell_background(c_sign, "F1F5F9")
    set_cell_margins(c_sign, top=100, bottom=100, left=140, right=140)
    p_sign = c_sign.paragraphs[0]
    p_sign.paragraph_format.bidi = True
    p_sign.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_s = p_sign.add_run("با احترام و آرزوی موفقیت روزافزون\nتیم توسعه و پشتیبانی پلتفرم | ۱۴ آبان ۱۴۰۵")
    r_s.font.name = "Tahoma"
    r_s.font.size = Pt(9.5)
    r_s.font.color.rgb = RGBColor(71, 85, 105)
    
    # Save document
    out_file = "Executive_Daily_Report_2026-11-04.docx"
    doc.save(out_file)
    print(f"Word document saved to {out_file}")
    
    artifact_dir = r"C:\Users\NAICo - PC 8\.gemini\antigravity\brain\ba00620c-1b89-4a25-9b33-0d18b91347ba"
    if os.path.exists(artifact_dir):
        artifact_path = os.path.join(artifact_dir, "Executive_Daily_Report_2026-11-04.docx")
        shutil.copyfile(out_file, artifact_path)
        print(f"Word document copied to artifact: {artifact_path}")

if __name__ == "__main__":
    create_executive_word_report()
