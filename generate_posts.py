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

SYSTEM_PROMPT = f"""أنت خبير في التسويق على وسائل التواصل الاجتماعي لوكالة سياحية جزائرية.

{FACTS}

قواعد صارمة لا تُكسر أبدًا:
1. لا تستعمل كلمة "حج" أبدًا — الخدمة عمرة فقط.
2. لا تخترع تصنيف نجوم للفنادق — استعمل المسافة من الحرم (~700م) بدلًا منها.
3. منشورات الإثبات: لا تخترع شهادات أو أسماء أو اقتباسات — اترك عنصرًا نائبًا هكذا: [أضف شهادة حقيقية هنا]
4. منشورات الاستعجال: لا تخترع أرقام أماكن كاذبة — اكتب [العدد الحقيقي] كعنصر نائب.
5. لا تكرر الملكية: قل "العمرة متاعك" لا "عمرتك متاعك".
6. لا تحشو "بصح" في غير محلها — استعملها فقط للمقابلة.

قواعد اللغة — دارجة جزائرية أصيلة:
- استعمل: متاع/متاعنا/متاعكم، يسر (كثير)، باه (لكي)، بصح (للمقابلة فقط)، برك (فقط)، دروك (الآن)، علاه (لماذا)، واه/ماشي، جماعة، هذي/هذا، كيفاه
- لا تستعمل: ديالكم، بزاف، باش، هاد، كيفاش (مغربية)
- الطول: 120-200 كلمة
- الأسلوب: حميمي، مقنع، طبيعي — بدون مبالغة"""


def build_prompt(post_type_ar: str, post_type_en: str, index: int) -> str:
    guidance = {
        "سعر": (
            "اكتب منشور سعر يفصّل ما يشمله العرض (استعمل الحقائق الثابتة فقط: "
            "التذكرة، التأشيرة، الفنادق بالأسماء الحقيقية ومسافتها من الحرم، النقل، المزارات). "
            "اذكر السعر 215,000 دج بوضوح. CTA: علّق بـ'عمرة'."
        ),
        "إثبات": (
            "اكتب منشور شهادة بهذا الهيكل الثابت: "
            "مقدمة تحفيزية قصيرة، ثم العنصر النائب [أضف شهادة حقيقية هنا] بالضبط هكذا (لا تخترع نصًا)، "
            "ثم CTA: علّق بـ'عمرة'."
        ),
        "استعجال": (
            "اكتب منشور استعجال صادق: ركز على الموسم القادم أو أهمية التخطيط المبكر. "
            "إذا أردت ذكر عدد الأماكن اكتب [العدد الحقيقي] بالضبط (لا تخترع رقمًا). "
            "CTA: علّق بـ'عمرة'."
        ),
        "أسئلة": (
            "اطرح سؤالًا تفاعليًا واحدًا يشجع على التعليق (مثل: أحسن حاجة في العمرة عندك؟ "
            "أو: واش تحب تروح مع العيلة ولا مع الأصحاب؟). "
            "اربط السؤال بالعمرة متاعة Djen-Djen. CTA: علّق بـ'عمرة'."
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
