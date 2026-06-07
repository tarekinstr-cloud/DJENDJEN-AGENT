import json
import os
import anthropic
import config

POST_TYPES = [
    ("سعر", "price offer post"),
    ("سعر", "price offer post"),
    ("سعر", "price offer post"),
    ("إثبات", "testimonial / social proof post"),
    ("إثبات", "testimonial / social proof post"),
    ("إثبات", "testimonial / social proof post"),
    ("استعجال", "urgency / scarcity post"),
    ("استعجال", "urgency / scarcity post"),
    ("استعجال", "urgency / scarcity post"),
    ("أسئلة", "interactive question post"),
    ("أسئلة", "interactive question post"),
    ("أسئلة", "interactive question post"),
]

SYSTEM_PROMPT = f"""أنت خبير في التسويق على وسائل التواصل الاجتماعي لوكالة سياحية جزائرية.
وكالتنا: {config.AGENCY_NAME}
السعر الرسمي لباقة العمرة: {config.UMRAH_PRICE}
رقم التواصل: {config.CONTACT_PHONE or 'واتساب متاعنا'}

اكتب منشورات فيسبوك بالدارجة الجزائرية الأصيلة.
قواعد اللغة:
- استعمل: متاع/متاعنا/متاعكم (النسبة)، يسر (كثير)، باه (لكي)، بصح (لكن)، برك (فقط)، دروك (الآن)، علاه (لماذا)، واه/ماشي (نعم/لا)، جماعة، هذي/هذا، كيفاه
- لا تستعمل: ديالكم، بزاف، باش، هاد، كيفاش (هذه مغربية)
- كل منشور يحتوي على CTA واضح للعمرة
- استعمل إيموجيات مناسبة
- الطول: 150-250 كلمة لكل منشور
- الأسلوب: حميمي، مقنع، جزائري أصيل"""


def build_prompt(post_type_ar: str, post_type_en: str, index: int) -> str:
    examples = {
        "سعر": "ركز على السعر 215,000 دينار، ما يشمله (تذكرة، فندق، تأشيرة)، والقيمة مقارنة بالسوق",
        "إثبات": "اكتب شهادة حقيقية من حاج جزائري رجع من العمرة، بأسلوب قصصي مؤثر",
        "استعجال": "أكد محدودية الأماكن، الموسم القادم، أو عرض خاص لفترة محدودة",
        "أسئلة": "اطرح سؤالًا تفاعليًا يشجع الجمهور على التعليق (مثل: واش تحب تروح؟ أو أحسن ذكرى متاعك في السفر؟)",
    }
    return f"""اكتب منشور فيسبوك من نوع "{post_type_ar}" ({post_type_en}).
التوجيه: {examples.get(post_type_ar, '')}
رقم المنشور: {index + 1} من 12
أعطني المنشور مباشرة بدون مقدمة أو شرح."""


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
