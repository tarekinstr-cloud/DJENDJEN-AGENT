import json
import os
import anthropic
import config

POST_TYPES = [
    ("سعر", "price offer post"),
    ("سعر", "price offer post"),
    ("سعر", "price offer post"),
    ("إثبات", "testimonial placeholder post"),
    ("إثبات", "testimonial placeholder post"),
    ("إثبات", "testimonial placeholder post"),
    ("استعجال", "honest urgency post"),
    ("استعجال", "honest urgency post"),
    ("استعجال", "honest urgency post"),
    ("أسئلة", "interactive question post"),
    ("أسئلة", "interactive question post"),
    ("أسئلة", "interactive question post"),
]

# ──────────────────────────────────────────────
# حقائق ثابتة — لا تُخترع ولا تُغيَّر
# ──────────────────────────────────────────────
FACTS = """
الوكالة: Djen-Djen Travel
الخدمة: عمرة (وليس حجًّا — كلمة "حج" محظورة نهائيًا في كل المنشورات)
السعر: 215,000 دينار جزائري
الطيران: رحلة مباشرة من مطار قسنطينة
فنادق مكة المكرمة: فندق الأيام (شارع بير بليلة) أو واحة الضيافة (شارع أجياد) — كلاهما على بُعد ~700م من ساحة الحرم
فندق المدينة المنورة: مع مجموعة الزهراء
السعر يشمل: التذكرة + التأشيرة + حجز الفنادق في مكة والمدينة + النقل + المزارات في مكة والمدينة
CTA: اطلب من الجمهور التعليق بكلمة "عمرة"
"""

SYSTEM_PROMPT = f"""أنت متخصص في تسويق خدمات السفر على وسائل التواصل الاجتماعي.

{FACTS}

قواعد صارمة لا تُخالَف أبدًا:
1. لا تستخدم كلمة "حج" أبدًا — الخدمة عمرة فقط.
2. لا تخترع تصنيف نجوم للفنادق — استخدم المسافة من الحرم (~700م) بدلًا من ذلك.
3. منشورات الإثبات: لا تخترع شهادات أو أسماء أو اقتباسات — اترك العنصر النائب هكذا بالضبط: [أضف شهادة حقيقية هنا]
4. منشورات الاستعجال: لا تخترع أرقام أماكن — اكتب [العدد الحقيقي] كعنصر نائب.
5. CTA موحّد في كل منشور: "علّق بكلمة عمرة".

أسلوب اللغة — عربية فصحى بسيطة:
- جُمل قصيرة وواضحة، مفردات سهلة يفهمها الجميع.
- نبرة دافئة ومحترمة تليق بموضوع العمرة الروحاني.
- تجنّب التكلّف البلاغي والمصطلحات القديمة — اكتب كما تكتب صفحة احترافية حديثة.
- لا دارجة، لا عامية — فصحى بسيطة فقط.
- الطول: 100-180 كلمة لكل منشور."""


def build_prompt(post_type_ar: str, post_type_en: str, index: int) -> str:
    guidance = {
        "سعر": (
            "اكتب منشور عرض سعر يوضّح ما يشمله العرض (استخدم الحقائق الثابتة فقط: "
            "التذكرة، التأشيرة، الفنادق بأسمائها الحقيقية ومسافتها من الحرم، النقل، المزارات). "
            "اذكر السعر 215,000 دج بوضوح. CTA: علّق بكلمة عمرة."
        ),
        "إثبات": (
            "اكتب منشور شهادة بهذا الهيكل الثابت: "
            "مقدمة تحفيزية قصيرة بالفصحى، ثم العنصر النائب [أضف شهادة حقيقية هنا] بالضبط هكذا دون تعديل (لا تخترع نصًا)، "
            "ثم جملة ختامية وCTA: علّق بكلمة عمرة."
        ),
        "استعجال": (
            "اكتب منشور استعجال صادق بالفصحى: ركز على أهمية التخطيط المبكر أو اقتراب الموسم. "
            "إذا أردت ذكر عدد الأماكن اكتب [العدد الحقيقي] بالضبط (لا تخترع رقمًا). "
            "CTA: علّق بكلمة عمرة."
        ),
        "أسئلة": (
            "اطرح سؤالًا تفاعليًا واحدًا بالفصحى يشجع على التعليق "
            "(مثل: ما أجمل ذكرى تتمنى أن تعيشها في العمرة؟ أو: هل تفضّل أداء العمرة مع العائلة أم مع الأصدقاء؟). "
            "اربط السؤال بعمرة Djen-Djen. CTA: علّق بكلمة عمرة."
        ),
    }
    return (
        f"اكتب منشور فيسبوك من نوع '{post_type_ar}' ({post_type_en}).\n"
        f"التوجيه: {guidance.get(post_type_ar, '')}\n"
        f"رقم المنشور: {index + 1} من 12\n"
        "أعطني المنشور مباشرة بدون مقدمة أو شرح."
    )


def generate_posts() -> list[dict]:
    client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)
    posts = []

    for i, (type_ar, type_en) in enumerate(POST_TYPES):
        print(f"جاري توليد المنشور {i + 1}/12 — نوع: {type_ar}...")

        with client.messages.stream(
            model=config.MODEL,
            max_tokens=1024,
            thinking={"type": "adaptive"},
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": build_prompt(type_ar, type_en, i)}],
        ) as stream:
            content = stream.get_final_message().content

        text = next((b.text for b in content if hasattr(b, "text")), "")

        posts.append(
            {
                "id": i + 1,
                "type": type_ar,
                "type_en": type_en,
                "content": text.strip(),
            }
        )

    return posts


def save_posts(posts: list[dict]) -> str:
    os.makedirs(config.OUTPUT_DIR, exist_ok=True)
    path = os.path.join(config.OUTPUT_DIR, "posts.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(
            {"agency": config.AGENCY_NAME, "total": len(posts), "posts": posts},
            f,
            ensure_ascii=False,
            indent=2,
        )
    return path


def main():
    if not config.ANTHROPIC_API_KEY:
        raise ValueError("ANTHROPIC_API_KEY غير موجودة — انسخ .env.example إلى .env وأضف مفتاحك")

    print(f"🕌 {config.AGENCY_NAME} — توليد 12 منشور عمرة بالدارجة الجزائرية\n")
    posts = generate_posts()
    path = save_posts(posts)
    print(f"\n✅ تم حفظ {len(posts)} منشور في: {path}")

    for p in posts:
        print(f"\n{'='*60}")
        print(f"[{p['id']}/12] نوع: {p['type']}")
        print(p["content"])


if __name__ == "__main__":
    main()
