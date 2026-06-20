import os
import re
import json
import base64
from typing import List, Tuple
import google.generativeai as genai
from dotenv import load_dotenv
from database import SessionLocal
import models

load_dotenv()

# ── Configuration Gemini ──────────────────────────────────────────────────────
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# ── System prompt ─────────────────────────────────────────────────────────────
system_prompt = (
    "Tu es Abdou (aussi appele Abba), mecanicien expert et ami dans la wilaya de Oum El Bouaghi, Algerie. "
    "Ta zone couvre TOUTE la wilaya: Ain Mlila, Oum El Bouaghi, Ain Beida, Ain Fakroun, et toutes les communes. "
    "Tu connais TOUS les garages et mecaniciens de la wilaya. Les prix sont en Dinars Algeriens (DZD).\n\n"
    "LANGUE: Si [LANG:AR] reponds en darija algerienne naturelle. Si [LANG:FR] reponds en francais. Sinon detecte automatiquement.\n\n"
    "INTELLIGENCE EMOTIONNELLE ET HUMAINE:\n"
    "- Salutations (salam, bonjour, ahlan, wach rak, labas): reponds chaleureusement, demande comment tu peux aider.\n"
    "- Remerciements (merci, chokran, barak allah fik): reponds avec plaisir, reste disponible.\n"
    "- Frustration/colere (ca marche pas, nul, inutile): sois patient, propose de l aide concrete.\n"
    "- Urgence (vite, urgent, en panne sur la route): reagis rapidement, donne les infos essentielles en premier.\n"
    "- Questions vagues (j ai un probleme, ma voiture fait un bruit): pose une question simple pour comprendre mieux.\n"
    "- Bonne humeur/blague: reponds avec legerte et humour algerien naturel.\n"
    "- Compliments (t es fort, bravo): accepte avec modestie et humour.\n"
    "- Au revoir (bslama, a bientot, yallah bye): reponds chaleureusement, souhaite bonne route.\n\n"
    "STYLE OBLIGATOIRE: Parle comme un vrai ami mecanicien algerien. "
    "INTERDIT ABSOLU: tableaux, markdown, titres avec ##, asterisques **gras**. "
    "Ecris en texte naturel, phrases courtes, ton chaleureux et direct. Emojis avec moderation.\n\n"
    "REGLES OUTILS:\n"
    "- garage/mecanicien/atelier/depanneur -> utilise trouver_garage immediatement\n"
    "- ou acheter/fournisseur -> utilise trouver_fournisseur\n"
    "- panne/symptome/bruit -> utilise diagnostic\n"
    "- prix/combien/dispo -> utilise prix_stock\n"
    "- commander -> utilise commandes\n"
    "- entretien/vidange/kilometrage -> utilise entretien_vehicule\n"
    "- main d oeuvre/cout pose -> utilise main_oeuvre\n"
    "- occasion/acheter voiture -> utilise checklist_occasion\n"
    "- prochaine vidange/rappel -> utilise rappel_entretien\n"
    "- danger/urgent/fumer/surchauffe -> utilise urgence_panne\n\n"
    "REGLES ABSOLUES:\n"
    "- Ain Beida, Ain Fakroun, Ain Mlila, Oum El Bouaghi = TOUTES dans ta zone, tu les connais toutes.\n"
    "- Ne dis JAMAIS qu une ville est hors zone ou loin.\n"
    "- Quand tu recois des garages, presente-les directement: nom, ville, telephone. C est tout.\n"
    "- Ne commente pas la distance entre les villes."
)

# ── Gemini tools definition ───────────────────────────────────────────────────
gemini_tools = [
    genai.protos.Tool(
        function_declarations=[
            genai.protos.FunctionDeclaration(
                name="diagnostic",
                description="Analyse les symptomes d une panne automobile.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={"symptomes": genai.protos.Schema(type=genai.protos.Type.STRING)},
                    required=["symptomes"]
                )
            ),
            genai.protos.FunctionDeclaration(
                name="identification_pieces",
                description="Identifie une piece pour le vehicule.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={
                        "nom_piece": genai.protos.Schema(type=genai.protos.Type.STRING),
                        "modele_vehicule": genai.protos.Schema(type=genai.protos.Type.STRING),
                    },
                    required=["nom_piece"]
                )
            ),
            genai.protos.FunctionDeclaration(
                name="prix_stock",
                description="Verifie le prix et le stock d une piece.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={"reference_piece": genai.protos.Schema(type=genai.protos.Type.STRING)},
                    required=["reference_piece"]
                )
            ),
            genai.protos.FunctionDeclaration(
                name="trouver_fournisseur",
                description="Trouve un fournisseur de pieces.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={
                        "specialite": genai.protos.Schema(type=genai.protos.Type.STRING),
                        "ville": genai.protos.Schema(type=genai.protos.Type.STRING),
                    },
                    required=["specialite"]
                )
            ),
            genai.protos.FunctionDeclaration(
                name="trouver_garage",
                description="Trouve un garage ou mecanicien dans la wilaya.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={
                        "type_reparation": genai.protos.Schema(type=genai.protos.Type.STRING),
                        "ville": genai.protos.Schema(type=genai.protos.Type.STRING),
                    }
                )
            ),
            genai.protos.FunctionDeclaration(
                name="entretien_vehicule",
                description="Programme d entretien pour un vehicule.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={
                        "modele": genai.protos.Schema(type=genai.protos.Type.STRING),
                        "kilometrage": genai.protos.Schema(type=genai.protos.Type.INTEGER),
                    },
                    required=["modele"]
                )
            ),
            genai.protos.FunctionDeclaration(
                name="main_oeuvre",
                description="Estime le cout de main d oeuvre.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={"type_reparation": genai.protos.Schema(type=genai.protos.Type.STRING)},
                    required=["type_reparation"]
                )
            ),
            genai.protos.FunctionDeclaration(
                name="checklist_occasion",
                description="Checklist pour inspecter une voiture d occasion.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={"modele": genai.protos.Schema(type=genai.protos.Type.STRING)}
                )
            ),
            genai.protos.FunctionDeclaration(
                name="rappel_entretien",
                description="Calcule la prochaine echeance d entretien.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={
                        "derniere_vidange_km": genai.protos.Schema(type=genai.protos.Type.INTEGER),
                        "km_actuel": genai.protos.Schema(type=genai.protos.Type.INTEGER),
                    },
                    required=["km_actuel"]
                )
            ),
            genai.protos.FunctionDeclaration(
                name="urgence_panne",
                description="Conseils urgents en cas de panne grave.",
                parameters=genai.protos.Schema(
                    type=genai.protos.Type.OBJECT,
                    properties={"symptome_urgent": genai.protos.Schema(type=genai.protos.Type.STRING)},
                    required=["symptome_urgent"]
                )
            ),
        ]
    )
]

# ── Keywords ──────────────────────────────────────────────────────────────────
_SOCIAL_KW = [
    "salam", "bonjour", "bonsoir", "salut", "ahlan", "wach rak", "labas", "la bas",
    "merci", "chokran", "barak allah", "shukran", "thank",
    "bslama", "a bientot", "au revoir", "yallah bye", "bye", "ciao", "tchao",
    "comment tu vas", "ca va", "kif rak", "kif nta",
    "bravo", "t es fort", "bien joue", "chapeau", "excellent",
    "nul", "inutile", "ca marche pas", "pas bien",
    "qui es tu", "tu es qui", "c est quoi", "tu fais quoi",
    "aide moi", "help", "aidez moi",
]

_VILLES_MAP = {
    "ain beida": "Aïn Beida", "beida": "Aïn Beida",
    "ain fakroun": "Aïn Fakroun", "fakroun": "Aïn Fakroun",
    "ain mlila": "Aïn Mlila", "mlila": "Aïn Mlila",
    "oum el bouaghi": "Oum El Bouaghi", "oum bouaghi": "Oum El Bouaghi",
    "oeb": "Oum El Bouaghi", "bouaghi": "Oum El Bouaghi",
}

_GARAGE_KW = [
    "garage", "mecanicien", "mecanicienne", "atelier", "depanneur",
    "mecano", "reparer", "reparation", "mecanique",
]

# ── Clean text ────────────────────────────────────────────────────────────────
def _clean(text: str) -> str:
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*\n]+)\*", r"\1", text)
    text = re.sub(r"#{1,6} ?", "", text)
    text = re.sub(r"`+", "", text)
    return text.strip()

# ── Execute tool ──────────────────────────────────────────────────────────────
def execute_tool(name: str, inputs: dict) -> str:
    db = SessionLocal()
    try:
        if name == "diagnostic":
            s = inputs.get("symptomes", "").lower()
            if any(k in s for k in ["frein", "grinc", "pedale", "stop"]):
                return "Usure probable des plaquettes de frein. Intervention urgente sous 500 km."
            elif any(k in s for k in ["moteur", "vibr", "cliquetis", "bruit"]):
                return "Possible probleme bougies, support moteur ou distribution."
            elif any(k in s for k in ["batterie", "demarr", "electr"]):
                return "Batterie faible ou alternateur defaillant. Tester tension: 13.8-14.4V moteur tournant."
            elif any(k in s for k in ["surchauffe", "temperature", "fumee"]):
                return "Probleme refroidissement. Verifier niveau liquide, thermostat, pompe a eau."
            elif any(k in s for k in ["direction", "volant", "dur"]):
                return "Probleme direction assistee. Verifier niveau huile direction."
            elif any(k in s for k in ["embrayage", "patine", "vitesse"]):
                return "Embrayage use. Verifier jeu pedale et disque."
            return "Plusieurs causes possibles. Inspection visuelle recommandee."

        elif name == "identification_pieces":
            nom = inputs.get("nom_piece", "").lower()
            pieces = db.query(models.Piece).filter(models.Piece.nom.ilike(f"%{nom}%")).limit(3).all()
            if pieces:
                return "Pieces trouvees:\n" + "".join(f"- {p.nom} (Ref: {p.reference}) - {p.prix:.0f} DZD - Stock: {p.stock}\n" for p in pieces)
            return f"Aucune piece trouvee pour '{nom}'."

        elif name == "prix_stock":
            ref = inputs.get("reference_piece", "").lower()
            p = db.query(models.Piece).filter(
                (models.Piece.reference.ilike(f"%{ref}%")) | (models.Piece.nom.ilike(f"%{ref}%"))
            ).first()
            if p:
                dispo = "Disponible" if p.stock > 0 else "Rupture de stock"
                return f"{p.nom} | Ref: {p.reference} | Prix: {p.prix:.0f} DZD | Stock: {p.stock} | {dispo}\n{p.description}"
            return f"Piece '{ref}' non trouvee."

        elif name == "commandes":
            pieces_list = inputs.get("pieces", [])
            total, details = 0, []
            for nom_piece in pieces_list:
                p = db.query(models.Piece).filter(models.Piece.nom.ilike(f"%{nom_piece}%")).first()
                if p and p.stock > 0:
                    total += p.prix
                    details.append(f"{p.nom}: {p.prix:.0f} DZD")
            if details:
                import random as _r
                return f"Commande OK - {', '.join(details)} - Total: {total:.0f} DZD - N: CMD-{_r.randint(1000,9999)}"
            return "Aucune piece disponible."

        elif name == "trouver_fournisseur":
            specialite = inputs.get("specialite", "")
            ville = inputs.get("ville", "")
            query = db.query(models.Fournisseur)
            if specialite:
                query = query.filter(models.Fournisseur.specialite.ilike(f"%{specialite}%"))
            if ville:
                query = query.filter(models.Fournisseur.ville.ilike(f"%{ville}%"))
            fournisseurs = query.limit(5).all()
            if not fournisseurs:
                fournisseurs = db.query(models.Fournisseur).limit(5).all()
            return "Fournisseurs:\n" + "".join(f"- {f.nom} | {f.ville} | Tel: {f.telephone} | {f.adresse}\n" for f in fournisseurs)

        elif name == "trouver_garage":
            type_rep = inputs.get("type_reparation", "")
            ville = inputs.get("ville", "")
            query = db.query(models.Garage)
            if ville:
                query = query.filter(models.Garage.ville == ville)
            if type_rep:
                q2 = query.filter(models.Garage.specialite.ilike(f"%{type_rep}%"))
                garages = q2.limit(5).all()
                if not garages:
                    garages = query.limit(5).all()
            else:
                garages = query.limit(5).all()
            if not garages:
                garages = db.query(models.Garage).limit(5).all()
            return "Garages:\n" + "".join(f"- {g.nom} | {g.ville} | Tel: {g.telephone} | {g.adresse}\n" for g in garages)

        elif name == "entretien_vehicule":
            modele = inputs.get("modele", "votre vehicule")
            km = inputs.get("kilometrage", 0)
            tasks = []
            if km == 0 or km % 5000 < 1000:
                tasks.append("vidange huile moteur + filtre huile")
            if km == 0 or km % 10000 < 1000:
                tasks.append("filtre a air, filtre habitacle")
            if km == 0 or km % 20000 < 1000:
                tasks.append("bougies d allumage, filtre carburant")
            if km == 0 or km % 40000 < 1000:
                tasks.append("courroie de distribution (si applicable)")
            if not tasks:
                tasks = ["vidange huile moteur", "verification generale"]
            return f"Entretien pour {modele} a {km} km: " + ", ".join(tasks) + ". Cout estimatif: 3500-8000 DZD selon les pieces."

        elif name == "main_oeuvre":
            t = inputs.get("type_reparation", "").lower()
            tarifs = {
                "vidange": "800-1200 DZD", "frein": "1500-2500 DZD", "embrayage": "4000-7000 DZD",
                "distribution": "5000-9000 DZD", "climatisation": "2000-4000 DZD",
                "electricite": "1500-3000 DZD", "carrosserie": "3000-10000 DZD",
                "pneu": "300-500 DZD/pneu", "geometrie": "1500-2500 DZD",
                "suspension": "2000-4000 DZD", "injection": "3000-6000 DZD",
            }
            for key, val in tarifs.items():
                if key in t:
                    return f"Main d oeuvre pour {t}: environ {val}. Prix final selon le garage."
            return f"Main d oeuvre pour {t}: entre 1000 et 5000 DZD selon la complexite. Demandez un devis au garage."

        elif name == "checklist_occasion":
            modele = inputs.get("modele", "la voiture")
            return (
                f"Checklist pour inspecter {modele} d occasion: "
                "1. Carrosserie: rouille, impacts, peinture uniforme. "
                "2. Moteur: fuites huile, fumee, bruit anormal. "
                "3. Boite de vitesses: passages fluides, pas de bruit. "
                "4. Freins: epaisseur plaquettes, disques non voiles. "
                "5. Pneus: usure uniforme, age max 5 ans. "
                "6. Interieur: climatisation, electrique, tableau de bord. "
                "7. Documents: carte grise, controle technique, historique entretien. "
                "8. Essai routier: 15-20 min minimum. "
                "Conseil: fais verifier par un mecanicien de confiance avant achat."
            )

        elif name == "rappel_entretien":
            km_actuel = inputs.get("km_actuel", 0)
            derniere = inputs.get("derniere_vidange_km", 0)
            if derniere:
                parcourus = km_actuel - derniere
                restant = 5000 - parcourus
                if restant <= 0:
                    return f"Vidange en retard de {abs(restant)} km! A faire immediatement."
                return f"Prochaine vidange dans {restant} km (a {derniere + 5000} km). Vous avez parcouru {parcourus} km depuis la derniere vidange."
            prochain = ((km_actuel // 5000) + 1) * 5000
            return f"Prochaine vidange recommandee a {prochain} km (dans {prochain - km_actuel} km)."

        elif name == "urgence_panne":
            s = inputs.get("symptome_urgent", "").lower()
            if any(k in s for k in ["fumee", "feu", "incendie", "brule"]):
                return "DANGER! Arretez immediatement, coupez le moteur, sortez du vehicule, eloignez-vous. Appelez le 14 (pompiers)."
            elif any(k in s for k in ["surchauffe", "temperature", "rouge"]):
                return "Arretez le moteur immediatement! Ne pas ouvrir le radiateur a chaud. Attendez 30 min. Verifiez le niveau liquide refroidissement froid."
            elif any(k in s for k in ["frein", "pedale", "plus de frein"]):
                return "Freins defaillants: retrogradez progressivement, utilisez le frein a main doucement, cherchez un obstacle mou pour arreter. Ne pas paniquer."
            elif any(k in s for k in ["direction", "volant", "plus de direction"]):
                return "Direction defaillante: gardez le calme, ralentissez progressivement, signalez et arretez-vous en securite."
            return "Arretez-vous en securite, mettez les feux de detresse. Appelez un depanneur ou un garage de la wilaya."

    finally:
        db.close()
    return "Information non disponible."


# ── Analyze image with Gemini Vision ─────────────────────────────────────────
async def analyze_image(image_b64: str, media_type: str, user_message: str) -> str:
    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        image_data = base64.b64decode(image_b64)
        prompt = (
            f"{user_message}\n\n"
            "Tu es Abdou (Abba), mecanicien a Ain Mlila, Algerie. Regarde cette image et reponds comme un vrai ami mecanicien.\n"
            "STYLE: texte naturel, ZERO markdown, ZERO asterisques. Phrases directes.\n"
            "Dis ce que tu vois, ce qui ne va pas, ce qu il faut faire, et le prix approximatif en DZD.\n"
            "Reponds dans la langue du message (francais, arabe, darija)."
        )
        response = await model.generate_content_async([
            {"mime_type": media_type, "data": image_data},
            prompt
        ])
        return _clean(response.text)
    except Exception as e:
        print(f"Erreur vision Gemini: {e}")
        return "Desole, je n ai pas pu analyser cette image."


# ── Main process_message ──────────────────────────────────────────────────────
async def process_message(user_message: str, session_id: str, image_b64=None, media_type=None):
    tools_triggered = []

    if image_b64:
        reply = await analyze_image(image_b64, media_type or "image/jpeg", user_message)
        return reply, ["vision_analysis"]

    msg_lower = user_message.lower().strip()

    # ETAPE 1: Detection sociale
    is_social = any(kw in msg_lower for kw in _SOCIAL_KW)
    tech_kw = ["garage", "piece", "panne", "frein", "moteur", "voiture", "prix", "mecanicien", "vidange", "huile"]
    is_short_nontechnical = len(msg_lower.split()) <= 3 and not any(k in msg_lower for k in tech_kw)

    model = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        system_instruction=system_prompt,
        tools=gemini_tools
    )

    if is_social or is_short_nontechnical:
        try:
            # Sans outils pour les messages sociaux
            simple_model = genai.GenerativeModel(
                model_name=GEMINI_MODEL,
                system_instruction=system_prompt
            )
            response = await simple_model.generate_content_async(user_message)
            return _clean(response.text), []
        except Exception as e:
            print("Erreur social Gemini:", e)
            return "Ahlan! Comment je peux t aider?", []

    # ETAPE 2: Detection ville
    detected_ville = ""
    for key, val in _VILLES_MAP.items():
        if key in msg_lower:
            detected_ville = val
            break

    # ETAPE 3: Forcer garage
    force_garage = any(kw in msg_lower for kw in _GARAGE_KW)
    if detected_ville and not force_garage:
        if any(k in msg_lower for k in ["mecani", "reparer", "depann", "trouver"]):
            force_garage = True

    if force_garage:
        tool_inputs = {"type_reparation": "", "ville": detected_ville}
        for kw in ["frein", "embrayage", "vidange", "distribution", "electricite",
                   "carrosserie", "peinture", "climatisation", "injection", "turbo",
                   "suspension", "geometrie", "pneu", "batterie"]:
            if kw in msg_lower:
                tool_inputs["type_reparation"] = kw
                break
        tool_result = execute_tool("trouver_garage", tool_inputs)
        tools_triggered.append("trouver_garage")
        try:
            followup = f"Voici les garages disponibles:\n{tool_result}\n\nMessage original: {user_message}"
            simple_model = genai.GenerativeModel(
                model_name=GEMINI_MODEL,
                system_instruction=system_prompt
            )
            response = await simple_model.generate_content_async(followup)
            return _clean(response.text) or _clean(tool_result), tools_triggered
        except Exception as e:
            print("Erreur Gemini forced:", e)
            return _clean(tool_result), tools_triggered

    # ETAPE 4: Flux normal avec function calling
    try:
        chat = model.start_chat()
        response = await chat.send_message_async(user_message)

        # Boucle function calling
        max_iterations = 5
        iteration = 0
        while response.candidates and iteration < max_iterations:
            iteration += 1
            has_function_call = False
            tool_results_parts = []

            for part in response.parts:
                if hasattr(part, "function_call") and part.function_call.name:
                    has_function_call = True
                    fn_name = part.function_call.name
                    fn_args = dict(part.function_call.args)
                    tools_triggered.append(fn_name)
                    result = execute_tool(fn_name, fn_args)
                    tool_results_parts.append(
                        genai.protos.Part(
                            function_response=genai.protos.FunctionResponse(
                                name=fn_name,
                                response={"result": result}
                            )
                        )
                    )

            if not has_function_call:
                break

            response = await chat.send_message_async(tool_results_parts)

        # Extraire le texte final
        final_text = ""
        for part in response.parts:
            if hasattr(part, "text") and part.text:
                final_text += part.text

        return _clean(final_text) or "Desole, pas de reponse.", tools_triggered

    except Exception as e:
        print("Erreur Gemini:", e)
        return "Desole, j ai un petit souci technique. Reessaie dans un instant!", tools_triggered
