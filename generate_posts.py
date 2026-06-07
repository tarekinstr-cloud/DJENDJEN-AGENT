import random
from datetime import datetime, timedelta

AGENCY_NAME = "Djen-Djen Travel"
UMRAH_PRICE = "215,000 DZD"
PHONE = "📞 Contactez-nous pour plus d'infos"
HASHTAGS_UMRAH = "#Omra #Omra2026 #DjenDjenTravel #Algerie #Voyage #Makkah #Madinah"
HASHTAGS_TIPS = "#ConseilsVoyage #DjenDjenTravel #Algerie #Voyage #Astuce"
HASHTAGS_INTER = "#DjenDjenTravel #Algerie #Voyage #Sondage #Communauté"
HASHTAGS_TESTI = "#Avis #DjenDjenTravel #Algerie #Omra #Satisfaction"

UMRAH_POSTS = [
    """🕋 OFFRE OMRA 2026 — {price} seulement !

Partez accomplir votre Omra avec {agency}, votre agence de confiance en Algérie.

✅ Vol aller-retour inclus
✅ Hébergement 4★ à La Mecque & Médine
✅ Transferts & encadrement religieux
✅ Visa Omra pris en charge
✅ Accompagnateur expérimenté tout au long du séjour

💰 À partir de {price} par personne

Les places sont limitées — réservez dès maintenant pour garantir votre place !

{phone}
{hashtags}""",

    """🌙 VOTRE RÊVE À PORTÉE DE MAIN — Omra {price}

{agency} vous offre un voyage spirituel inoubliable vers les Lieux Saints.

🛫 Départ depuis Alger
🏨 Hôtels proches des Harams
🤲 Encadrement religieux qualifié
📋 Toutes les démarches administratives gérées pour vous

✨ Prix tout inclus : {price} par personne

Ne laissez pas passer cette opportunité unique !
Appelez-nous ou envoyez un message en privé pour réserver.

{phone}
{hashtags}""",

    """🕌 OMRA — L'OFFRE QUI FAIT LA DIFFÉRENCE !

Avec {agency}, votre voyage spirituel est entre de bonnes mains.

📦 Notre forfait à {price} comprend :
• Billet d'avion aller-retour
• Hébergement en chambre double/triple
• Pension complète (selon formule)
• Guide religieux dédié
• Assurance voyage
• Carte SIM locale offerte

🗓️ Départs programmés tout au long de l'année

Faites confiance à l'expérience — faites confiance à {agency} !

{phone}
{hashtags}""",

    """✈️ PARTEZ EN OMRA AVEC SÉRÉNITÉ — {price}

{agency} s'occupe de tout pour que vous vous consacriez uniquement à l'adoration.

🌟 Pourquoi nous choisir ?
→ Plus de 10 ans d'expérience dans le voyage religieux
→ Équipe professionnelle & bienveillante
→ Suivi personnalisé de chaque pèlerin
→ Tarif transparent, sans surprises

💎 Forfait complet dès {price}

Contactez-nous aujourd'hui et partez l'esprit tranquille.

{phone}
{hashtags}""",
]

TIPS_POSTS = [
    """💡 ASTUCE VOYAGE #1 — Préparez votre valise comme un pro !

Voyager serein commence par une bonne préparation. Voici nos conseils :

🧳 Emportez uniquement le nécessaire (max 23 kg en soute)
💊 Mettez vos médicaments en bagage cabine
📄 Gardez vos documents (passeport, billets) toujours accessibles
🔌 Prenez un adaptateur universel
💧 Restez hydraté pendant le vol

Avec {agency}, vous voyagez l'esprit léger — on gère le reste !

{phone}
{hashtags}""",

    """🌍 ASTUCE VOYAGE #2 — Évitez le mal des transports !

Un long trajet ? Voici comment le rendre agréable :

😴 Dormez bien la veille du départ
🍋 Évitez les repas lourds avant et pendant le vol
👁️ Regardez l'horizon ou fermez les yeux
🎧 Musique douce ou podcasts pour se détendre
🧘 Faites quelques étirements toutes les 2 heures

{agency} veille à votre confort du début à la fin du voyage !

{phone}
{hashtags}""",

    """📸 ASTUCE VOYAGE #3 — Immortalisez vos souvenirs !

Quelques conseils pour garder de beaux souvenirs de vos voyages :

📱 Chargez vos appareils avant de partir
☁️ Activez la sauvegarde automatique de vos photos
🌅 Photographiez tôt le matin pour une belle lumière
🗺️ Notez les noms des lieux visités pour ne rien oublier
📔 Tenez un petit journal de voyage

Chaque voyage avec {agency} est une histoire à raconter !

{phone}
{hashtags}""",

    """💰 ASTUCE VOYAGE #4 — Gérez votre budget intelligemment !

Voyager malin, c'est voyager mieux. Nos conseils finance :

🏦 Changez de l'argent à l'avance pour éviter les mauvais taux
💳 Informez votre banque de votre destination
🧾 Gardez vos reçus pour le suivi de dépenses
🎁 Prévoyez un budget cadeaux et souvenirs
⚠️ Gardez une réserve d'urgence

Avec {agency}, nos forfaits tout inclus vous évitent les mauvaises surprises !

{phone}
{hashtags}""",

    """🧴 ASTUCE VOYAGE #5 — Santé & hygiène en voyage !

Rester en bonne santé pendant votre voyage, c'est essentiel :

💉 Vérifiez vos vaccinations avant de partir
🤲 Lavez-vous régulièrement les mains
🥗 Évitez les aliments douteux dans certains pays
🌡️ Emportez un thermomètre et une trousse de premiers soins
☀️ Protégez-vous du soleil (crème SPF, chapeau)

Voyagez sainement avec {agency} — votre bien-être est notre priorité !

{phone}
{hashtags}""",
]

INTERACTIVE_POSTS = [
    """🗳️ SONDAGE DU JOUR !

Quelle est votre destination de rêve pour 2026 ?

👉 Commentez avec votre réponse :
🕋 A — La Mecque & Médine (Omra)
🇹🇷 B — Istanbul, Turquie
🇦🇪 C — Dubaï, Émirats
🇫🇷 D — Paris, France
🌍 E — Autre destination (laquelle ?)

Partagez vos rêves avec nous ! {agency} peut les réaliser 🌟

{phone}
{hashtags}""",

    """❓ QUESTION DU JOUR !

Quand vous voyagez, quelle est votre priorité absolue ?

🏨 A — Un hébergement confortable
🍽️ B — La gastronomie locale
🗺️ C — Les sites historiques & culturels
💆 D — La tranquillité & la détente
📸 E — Les belles photos & souvenirs

Répondez en commentaire — on est curieux de vous connaître ! 😊

{agency} adapte chaque voyage à VOS envies.

{phone}
{hashtags}""",

    """🤔 DÉBAT VOYAGEUR !

Quelle formule préférez-vous ?

✈️🏨 A — Forfait tout inclus (sans prise de tête)
🗓️ B — Voyage organisé en groupe (plus convivial)
🎒 C — Voyage sur mesure (selon mes envies)

Dites-nous en commentaire ! Et si vous avez une anecdote de voyage, partagez-la — on adore vous lire 🥰

{agency} propose les 3 formules pour tous les profils de voyageurs !

{phone}
{hashtags}""",

    """💬 PARTAGEZ VOTRE EXPÉRIENCE !

Avez-vous déjà voyagé avec {agency} ?

Si oui — qu'est-ce que vous avez préféré dans votre voyage ?
Si non — quelle destination vous fait envie ?

👇 Répondez en commentaire, on lit et répond à TOUS les messages !

Votre avis compte énormément pour nous et pour notre communauté 🙏

{phone}
{hashtags}""",

    """🌟 JEU CONCOURS — GAGNEZ UN BON DE RÉDUCTION !

Pour participer :
1️⃣ Likez cette publication
2️⃣ Partagez sur votre profil
3️⃣ Taguez 2 amis qui adorent voyager

Le gagnant remportera un bon de réduction sur son prochain voyage avec {agency} !

Tirage au sort dans 48h ⏰ Bonne chance à tous !

{phone}
{hashtags}""",
]

TESTIMONIAL_POSTS = [
    """⭐⭐⭐⭐⭐ TÉMOIGNAGE CLIENT

« J'ai effectué mon Omra avec {agency} en 2025 et ce fut une expérience spirituelle et humaine extraordinaire. L'organisation était parfaite, l'hébergement excellent et l'accompagnateur très compétent. Je recommande vivement cette agence à tous ! »

— Fatima B., Alger

Merci Fatima pour ce beau témoignage 🙏
Vous aussi, faites confiance à {agency} pour votre prochain voyage !

{phone}
{hashtags}""",

    """💛 ILS NOUS FONT CONFIANCE — LISEZ LEURS MOTS !

« Dès le premier contact, l'équipe de {agency} nous a mis à l'aise. Ils ont géré tous les détails de notre voyage à Istanbul : visa, hôtel, excursions. On n'a eu qu'à profiter ! On reviendra sans hésiter. »

— Karim & Souad, Oran

Merci pour votre confiance et votre fidélité 🌟
Contactez-nous pour vivre la même expérience !

{phone}
{hashtags}""",

    """🙏 UN TÉMOIGNAGE QUI NOUS TOUCHE LE CŒUR

« Accomplir l'Omra était mon rêve depuis des années. Grâce à {agency}, ce rêve est devenu réalité. L'organisation était irréprochable, les guides très pédagogues, et le prix vraiment raisonnable pour la qualité offerte. Jazakoum Allahou Khayran. »

— Hadj Mohamed R., Constantine

Que Allah accepte votre Omra 🤲
Rejoignez des milliers de pèlerins satisfaits — réservez avec {agency} !

{phone}
{hashtags}""",

    """🌸 TÉMOIGNAGE — PREMIÈRE EXPÉRIENCE INTERNATIONALE

« C'était mon premier voyage à l'étranger et j'avais peur de mal gérer. L'équipe de {agency} m'a accompagné pas à pas, du visa jusqu'au retour. Je suis rentrée avec des souvenirs plein la tête et l'envie de repartir ! »

— Amina L., Sétif

Premier voyage ou dixième — {agency} vous accompagne toujours avec le même soin 💪

{phone}
{hashtags}""",

    """📣 CE QUE DISENT NOS CLIENTS PARLE MIEUX QUE NOUS !

« Forfait Omra à {price} — j'avais des doutes au début, mais la qualité était au-delà de mes attentes. Hôtel à 200m du Haram, repas délicieux, groupe formidable. Je repars l'année prochaine avec {agency} c'est certain ! »

— Noureddine T., Blida

Votre satisfaction est notre plus belle récompense 🏆

{phone}
{hashtags}""",
]


def get_week_posts(week_number: int, start_date: datetime) -> list[dict]:
    random.seed(week_number)

    categories = [
        ("Omra", random.choice(UMRAH_POSTS)),
        ("Astuce Voyage", random.choice(TIPS_POSTS)),
        ("Interactif", random.choice(INTERACTIVE_POSTS)),
        ("Témoignage", random.choice(TESTIMONIAL_POSTS)),
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
            hashtags=HASHTAGS_UMRAH if category == "Omra"
            else HASHTAGS_TIPS if category == "Astuce Voyage"
            else HASHTAGS_INTER if category == "Interactif"
            else HASHTAGS_TESTI,
        )
        posts.append({
            "week": week_number,
            "date": post_date.strftime("%A %d %B %Y"),
            "category": category,
            "content": content,
        })

    posts.sort(key=lambda p: p["date"])
    return posts


def generate_posts(num_weeks: int = 4, output_file: str = "posts.txt"):
    start_date = datetime(2026, 6, 8)  # Next Monday
    all_posts = []

    for week in range(1, num_weeks + 1):
        week_start = start_date + timedelta(weeks=week - 1)
        all_posts.extend(get_week_posts(week, week_start))

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("=" * 70 + "\n")
        f.write(f"  CALENDRIER FACEBOOK — {AGENCY_NAME.upper()}\n")
        f.write(f"  Généré le : {datetime.now().strftime('%d/%m/%Y à %H:%M')}\n")
        f.write(f"  Période : {num_weeks} semaines | {num_weeks * 4} publications\n")
        f.write("=" * 70 + "\n\n")

        current_week = 0
        for post in all_posts:
            if post["week"] != current_week:
                current_week = post["week"]
                f.write(f"\n{'━' * 70}\n")
                f.write(f"  SEMAINE {current_week}\n")
                f.write(f"{'━' * 70}\n\n")

            f.write(f"📅 DATE      : {post['date']}\n")
            f.write(f"🏷️  CATÉGORIE : {post['category']}\n")
            f.write(f"{'─' * 70}\n")
            f.write(post["content"])
            f.write(f"\n\n{'─' * 70}\n\n")

        f.write("=" * 70 + "\n")
        f.write("  FIN DU CALENDRIER\n")
        f.write(f"  Total : {len(all_posts)} publications sur {num_weeks} semaines\n")
        f.write("=" * 70 + "\n")

    print(f"✅ {len(all_posts)} publications générées dans '{output_file}'")
    print(f"   Période couverte : {num_weeks} semaines")
    print(f"   Catégories : Omra, Astuces Voyage, Interactif, Témoignages")


if __name__ == "__main__":
    generate_posts(num_weeks=4, output_file="posts.txt")
