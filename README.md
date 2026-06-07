# Djen-Djen Travel — Facebook Posts Agent

نظام توليد منشورات فيسبوك بالدارجة الجزائرية عبر Claude AI.

## الملفات

| الملف | الدور |
|---|---|
| `generate_posts.py` | يولّد 12 منشورًا متنوعًا عبر Claude API ويحفظها في `output/posts.json` |
| `config.py` | يقرأ الإعدادات من متغيرات البيئة (`.env`) |
| `.env.example` | قالب متغيرات البيئة — انسخه إلى `.env` |

## الإعداد

```bash
# 1. نسخ القالب
cp .env.example .env

# 2. أضف مفتاح Anthropic API في .env
#    ANTHROPIC_API_KEY=sk-ant-...

# 3. تثبيت المكتبات
pip install anthropic python-dotenv
```

## التشغيل

```bash
python generate_posts.py
```

الناتج يُحفظ في `output/posts.json` ويظهر في الطرفية.

## أنواع المنشورات (12 منشور)

| النوع | العدد | الهدف |
|---|---|---|
| سعر | 3 | عرض باقة العمرة بـ 215,000 دينار |
| إثبات | 3 | شهادات حجاج جزائريين |
| استعجال | 3 | محدودية الأماكن والعروض |
| أسئلة | 3 | تفاعل الجمهور وزيادة الوصول |

## متغيرات البيئة

| المتغير | مطلوب | الوصف |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | مفتاح Claude API |
| `FACEBOOK_PAGE_ID` | اختياري | معرف صفحة الفيسبوك |
| `FACEBOOK_ACCESS_TOKEN` | اختياري | رمز الوصول للنشر التلقائي |
| `AGENCY_NAME` | اختياري | اسم الوكالة (افتراضي: Djen-Djen Travel) |
| `UMRAH_PRICE` | اختياري | سعر العمرة (افتراضي: 215,000 DZD) |
| `CONTACT_PHONE` | اختياري | رقم الهاتف للتواصل |
| `CONTACT_WHATSAPP` | اختياري | رقم الواتساب |
