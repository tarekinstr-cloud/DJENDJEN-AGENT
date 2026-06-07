import random
from datetime import datetime, timedelta

AGENCY_NAME = "Djen-Djen Travel"
UMRAH_PRICE = "215,000 دج"
PHONE = "📞 تواصلوا معنا للمزيد من المعلومات"
HASHTAGS_UMRAH = "#عمرة #عمرة2026 #DjenDjenTravel #الجزائر #سفر #مكة #المدينة"
HASHTAGS_TIPS = "#نصائح_السفر #DjenDjenTravel #الجزائر #سفر #نصيحة"
HASHTAGS_INTER = "#DjenDjenTravel #الجزائر #سفر #استطلاع #مجتمع"
HASHTAGS_TESTI = "#تقييم #DjenDjenTravel #الجزائر #عمرة #رضا"

ARABIC_DAYS = {
    "Monday": "الاثنين",
    "Tuesday": "الثلاثاء",
    "Wednesday": "الأربعاء",
    "Thursday": "الخميس",
    "Friday": "الجمعة",
    "Saturday": "السبت",
    "Sunday": "الأحد",
}

ARABIC_MONTHS = {
    "January": "جانفي",
    "February": "فيفري",
    "March": "مارس",
    "April": "أفريل",
    "May": "ماي",
    "June": "جوان",
    "July": "جويلية",
    "August": "أوت",
    "September": "سبتمبر",
    "October": "أكتوبر",
    "November": "نوفمبر",
    "December": "ديسمبر",
}

ARABIC_CATEGORIES = {
    "عمرة": "عمرة",
    "نصائح السفر": "نصائح السفر",
    "تفاعلي": "تفاعلي",
    "شهادة": "شهادة عميل",
}


def arabic_date(dt: datetime) -> str:
    day_en = dt.strftime("%A")
    month_en = dt.strftime("%B")
    return f"{ARABIC_DAYS[day_en]} {dt.day} {ARABIC_MONTHS[month_en]} {dt.year}"


UMRAH_POSTS = [
    """🕋 عرض العمرة 2026 — بـ {price} برك !

سافروا تأدّوا العمرة مع {agency}، الوكالة اللي تثقوا فيها في الجزائر.

✅ رحلة ذهاب وإياب
✅ إقامة 4 نجوم في مكة المكرمة والمدينة المنورة
✅ نقل ومرافقة دينية
✅ تأشيرة العمرة مضمونة
✅ مرافق متمرس طول الرحلة

💰 من {price} للشخص الواحد

الأماكن محدودة — احجزوا دروك باه تضمنوا مكانكم !

{phone}
{hashtags}""",

    """🌙 حلمكم قريب — عمرة بـ {price}

{agency} تقدملكم رحلة روحانية ما تتنساش لأقدس البقاع.

🛫 المغادرة من الجزائر العاصمة
🏨 فنادق قريبة من الحرمين الشريفين
🤲 مرافقة دينية متخصصة
📋 كل الإجراءات الإدارية علينا إحنا

✨ الثمن شامل كل حاجة : {price} للشخص

ما تفوّتوش هذي الفرصة النادرة !
تصلو بينا ولا راسلونا على الخاص باه تحجزوا.

{phone}
{hashtags}""",

    """🕌 عمرة — العرض اللي يفرق !

مع {agency}، رحلتكم الروحانية في أيدي أمينة.

📦 الفورفي متاعنا بـ {price} يشمل :
• تذكرة الطائرة ذهاب وإياب
• إقامة في غرفة مزدوجة ولا ثلاثية
• وجبات كاملة (حسب الفورمول)
• مرشد ديني خاص
• تأمين على السفر
• شريحة SIM محلية بالمجان

🗓️ مواعيد مغادرة على مدار السنة

ثقوا في التجربة — ثقوا في {agency} !

{phone}
{hashtags}""",

    """✈️ سافروا للعمرة بقلب مرتاح — {price}

{agency} تتكفل بكل حاجة باه تتفرغوا للعبادة.

🌟 علاه تختارونا ؟
← أكثر من 10 سنين في السفر الديني
← فريق محترف ومتفاني
← متابعة شخصية لكل حاج
← ثمن واضح بلا مفاجآت

💎 فورفي كامل من {price}

تواصلوا معنا اليوم وسافروا بلا هم.

{phone}
{hashtags}""",
]

TIPS_POSTS = [
    """💡 نصيحة السفر #1 — جهّزوا الشنطة متاعكم كالمحترفين !

السفر براحة يبدا من التحضير المزيان. هاهي نصايحنا :

🧳 خذوا غير الضروري برك (ما تعدّوش 23 كيلو في الحامولة)
💊 حطوا الدواء في حقيبة الكابين
📄 الوثائق (الباسبور، التذاكر) تكونوا معاكم على طول
🔌 خذوا محوّل كهربائي عالمي
💧 اشربوا يسر ماء في الطيارة

مع {agency}، سافروا بقلب خفيف — إحنا نتكفلوا بالباقي !

{phone}
{hashtags}""",

    """🌍 نصيحة السفر #2 — تفادوا دوار السفر !

رحلة طويلة ؟ هاك كيفاه تخليوها مريحة :

😴 نوموا مليح الليلة اللي قبل المغادرة
🍋 ما تاكلوش ثقيل قبل وأثناء الطيران
👁️ شوفوا الأفق ولا غمضوا عيونكم
🎧 موسيقى هادية ولا بودكاست باه تسترخوا
🧘 تمططوا شوية كل ساعتين

{agency} تسهر على راحتكم من الأول للآخر !

{phone}
{hashtags}""",

    """📸 نصيحة السفر #3 — خلّدوا ذكرياتكم !

نصايح باه تحتفظوا بأجمل لحظات سفركم :

📱 شحنوا أجهزتكم قبل ما تسافروا
☁️ فعّلوا النسخ الاحتياطي التلقائي للصور
🌅 صوّروا في الصباح الباكر — الضوء يكون أجمل
🗺️ دوّنوا أسماء الأماكن باه ما تنساوش
📔 اكتبوا يومية سفر

كل رحلة مع {agency} هي حكاية تستاهل تُروى !

{phone}
{hashtags}""",

    """💰 نصيحة السفر #4 — دبّروا الميزانية متاعكم بذكاء !

السفر الذكي هو السفر الأحسن. نصايحنا المالية :

🏦 صرفوا الفلوس مسبقًا باه تتفادوا الأسعار الغالية
💳 عاودوا بلّغوا البنك متاعكم بالوجهة
🧾 احتفظوا بالفواتير لمتابعة المصاريف
🎁 حضّروا ميزانية للهدايا والتذكارات
⚠️ احتفظوا بمبلغ احتياطي للطوارئ

مع {agency}، فورفياتنا الشاملة تحميكم من أي مفاجأة !

{phone}
{hashtags}""",

    """🧴 نصيحة السفر #5 — الصحة والنظافة في السفر !

تبقوا بصحة كاملة في رحلتكم — هذا مهم يسر :

💉 تحققوا من التطعيمات قبل السفر
🤲 اغسلوا إيديكم على طول
🥗 تفادوا المأكولات المشكوك فيها في بعض البلدان
🌡️ خذوا ترمومتر وحقيبة إسعافات أولية
☀️ احموا روسكم من الشمس (كريم واقي، قبعة)

سافروا بصحة مع {agency} — صحتكم أولويتنا !

{phone}
{hashtags}""",
]

INTERACTIVE_POSTS = [
    """🗳️ استطلاع اليوم !

وين تحبوا تسافروا في 2026 ؟

👉 علّقوا بإجابتكم :
🕋 أ — مكة المكرمة والمدينة المنورة (عمرة)
🇹🇷 ب — إسطنبول، تركيا
🇦🇪 ج — دبي، الإمارات
🇫🇷 د — باريس، فرنسا
🌍 هـ — وجهة أخرى (قولولنا وين !)

شاركونا أحلامكم ! {agency} تقدر تحققها 🌟

{phone}
{hashtags}""",

    """❓ سؤال اليوم !

كي تسافروا، واش هو أهم حاجة عندكم ؟

🏨 أ — إقامة مريحة
🍽️ ب — المأكولات المحلية
🗺️ ج — المواقع التاريخية والثقافية
💆 د — الراحة والهدوء
📸 هـ — الصور والذكريات الجميلة

جاوبوا في التعليقات — نحبوا نعرفوكم أكثر ! 😊

{agency} تكيّف كل رحلة حسب رغباتكم.

{phone}
{hashtags}""",

    """🤔 نقاش المسافرين !

أنتم علاه تفضّلوا ؟

✈️🏨 أ — فورفي شامل كل حاجة (بلا هم)
🗓️ ب — رحلة منظمة مع جماعة (أمتع وأحلى)
🎒 ج — رحلة حسب مقاسي (على حسابي)

قولولنا في التعليقات ! وكي عندكم نكتة ولا قصة من سفر، شاركونا — نحبوا نقراوكم 🥰

{agency} تقدم الصيغ الثلاثة لكل أنواع المسافرين !

{phone}
{hashtags}""",

    """💬 شاركونا تجربتكم !

واش سبق سافرتوا مع {agency} ؟

واه — واش عجبكم أكثر في رحلتكم ؟
ماشي — أي وجهة تجذبكم ؟

👇 علّقوا هنا، إحنا نقراوا ونجاوبوا على كل التعليقات !

رأيكم يهمنا يسر ويهم المجتمع متاعنا كامل 🙏

{phone}
{hashtags}""",

    """🌟 مسابقة — ربحوا قسيمة تخفيض !

باه تشاركوا :
1️⃣ عجبوا المنشور
2️⃣ شاركوه على بروفايلكم
3️⃣ تاغوا 2 صحاب يحبوا السفر

الفايز يربح قسيمة تخفيض على رحلته الجاية مع {agency} !

القرعة بعد 48 ساعة ⏰ بالتوفيق للجميع !

{phone}
{hashtags}""",
]

TESTIMONIAL_POSTS = [
    """⭐⭐⭐⭐⭐ شهادة عميل

« عملت عمرتي مع {agency} في 2025 وكانت تجربة روحانية وإنسانية ما نتناساش. التنظيم كان مثالي، الإقامة ممتازة، والمرافق كان كفؤ يسر. ننصح بهذي الوكالة لكل الناس ! »

— فاطمة ب.، الجزائر العاصمة

يعطيك الصحة يا فاطمة على هذي الشهادة الجميلة 🙏
وأنتم كذلك، ثقوا في {agency} لرحلتكم الجاية !

{phone}
{hashtags}""",

    """💛 يثقوا فينا — اقراوا كلامهم !

« من أول تواصل، فريق {agency} ريّحونا. تكفلوا بكل تفاصيل الرحلة متاعنا لإسطنبول : الفيزا، الفندق، الجولات. ما كانش علينا غير نستمتعوا ! نرجعوا معهم بلا تردد. »

— كريم وسعاد، وهران

يعطيكم الصحة على ثقتكم ووفائكم 🌟
تواصلوا معنا وعيشوا نفس التجربة !

{phone}
{hashtags}""",

    """🙏 شهادة تلمس القلب

« العمرة كانت حلمي من سنين. بفضل {agency}، الحلم تحقق. التنظيم كان لا غبار عليه، المرشدين كانوا بيداغوجيين بصح، والثمن كان معقول للجودة المقدمة. جزاكم الله خيرًا. »

— الحاج محمد ر.، قسنطينة

تقبّل الله عمرتكم 🤲
انضموا لآلاف الحجاج الراضين — احجزوا مع {agency} !

{phone}
{hashtags}""",

    """🌸 شهادة — أول تجربة في الخارج

« كانت أول مرة نسافر لبرا وكنت خايف ما نعرفش ندبّر روحي. فريق {agency} رافقني خطوة بخطوة من الفيزا لحتى العودة. رجعت بذكريات مليحة وبالحرص نعاود نسافر ! »

— أمينة ل.، سطيف

أول رحلة ولا عاشرة — {agency} دايما معاكم بنفس الاهتمام 💪

{phone}
{hashtags}""",

    """📣 كلام العملاء متاعنا يحكي عوضنا !

« الفورفي متاع العمرة بـ {price} — في الأول كنت مشكّك، بصح الجودة فاقت توقعاتي. الفندق على بعد 200 متر من الحرم، الأكل لذيذ، والجماعة كانت رائعة. نرجع العام الجاي مع {agency} حتمًا ! »

— نور الدين ت.، البليدة

رضاكم هو أجمل مكافأة لينا 🏆

{phone}
{hashtags}""",
]


def get_week_posts(week_number: int, start_date: datetime) -> list[dict]:
    random.seed(week_number)

    categories = [
        ("عمرة", random.choice(UMRAH_POSTS)),
        ("نصائح السفر", random.choice(TIPS_POSTS)),
        ("تفاعلي", random.choice(INTERACTIVE_POSTS)),
        ("شهادة", random.choice(TESTIMONIAL_POSTS)),
    ]

    days_offsets = [0, 2, 4, 6]
    random.shuffle(days_offsets)

    posts = []
    for i, (category, template) in enumerate(categories):
        post_date = start_date + timedelta(days=days_offsets[i])
        content = template.format(
            agency=AGENCY_NAME,
            price=UMRAH_PRICE,
            phone=PHONE,
            hashtags=HASHTAGS_UMRAH if category == "عمرة"
            else HASHTAGS_TIPS if category == "نصائح السفر"
            else HASHTAGS_INTER if category == "تفاعلي"
            else HASHTAGS_TESTI,
        )
        posts.append({
            "week": week_number,
            "date": arabic_date(post_date),
            "category": category,
            "content": content,
        })

    posts.sort(key=lambda p: (start_date + timedelta(days=days_offsets[i])).toordinal()
               if False else post_date.toordinal())
    return posts


def get_week_posts(week_number: int, start_date: datetime) -> list[dict]:
    random.seed(week_number)

    pool = [
        ("عمرة", UMRAH_POSTS),
        ("نصائح السفر", TIPS_POSTS),
        ("تفاعلي", INTERACTIVE_POSTS),
        ("شهادة", TESTIMONIAL_POSTS),
    ]

    days_offsets = [0, 2, 4, 6]
    random.shuffle(days_offsets)

    posts = []
    for i, (category, templates) in enumerate(pool):
        template = random.choice(templates)
        post_date = start_date + timedelta(days=days_offsets[i])
        content = template.format(
            agency=AGENCY_NAME,
            price=UMRAH_PRICE,
            phone=PHONE,
            hashtags=HASHTAGS_UMRAH if category == "عمرة"
            else HASHTAGS_TIPS if category == "نصائح السفر"
            else HASHTAGS_INTER if category == "تفاعلي"
            else HASHTAGS_TESTI,
        )
        posts.append({
            "week": week_number,
            "date": arabic_date(post_date),
            "sort_key": post_date.toordinal(),
            "category": category,
            "content": content,
        })

    posts.sort(key=lambda p: p["sort_key"])
    return posts


def generate_posts(num_weeks: int = 4, output_file: str = "posts.txt"):
    start_date = datetime(2026, 6, 8)
    all_posts = []

    for week in range(1, num_weeks + 1):
        week_start = start_date + timedelta(weeks=week - 1)
        all_posts.extend(get_week_posts(week, week_start))

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("=" * 70 + "\n")
        f.write(f"  روزنامة فيسبوك — {AGENCY_NAME}\n")
        f.write(f"  تاريخ الإنشاء : {datetime.now().strftime('%d/%m/%Y - %H:%M')}\n")
        f.write(f"  المدة : {num_weeks} أسابيع | {num_weeks * 4} منشور\n")
        f.write("=" * 70 + "\n\n")

        current_week = 0
        for post in all_posts:
            if post["week"] != current_week:
                current_week = post["week"]
                f.write(f"\n{'━' * 70}\n")
                f.write(f"  الأسبوع {current_week}\n")
                f.write(f"{'━' * 70}\n\n")

            f.write(f"📅 التاريخ    : {post['date']}\n")
            f.write(f"🏷️  الفئة      : {post['category']}\n")
            f.write(f"{'─' * 70}\n")
            f.write(post["content"])
            f.write(f"\n\n{'─' * 70}\n\n")

        f.write("=" * 70 + "\n")
        f.write("  نهاية الروزنامة\n")
        f.write(f"  المجموع : {len(all_posts)} منشور على {num_weeks} أسابيع\n")
        f.write("=" * 70 + "\n")

    print(f"✅ {len(all_posts)} منشور تم إنشاؤه في '{output_file}'")
    print(f"   المدة المغطاة : {num_weeks} أسابيع")
    print(f"   الفئات : عمرة، نصائح السفر، تفاعلي، شهادات")


if __name__ == "__main__":
    generate_posts(num_weeks=4, output_file="posts.txt")
