# Denti Luxe — Configuration Shopify

Store : **My Store 3** · `0tnakn-rr.myshopify.com` · compte eyeliftz@gmail.com
Devise : MAD · Pays : Maroc · Plan : Basic · Thème de base : Horizon

## 1. Produit créé

**Hydropulseur Denti Luxe — Jet Dentaire Sans Fil**

| Champ | Valeur |
|-------|--------|
| Statut | `ACTIVE` (en ligne) |
| Prix | **299 MAD** |
| Prix comparé (barré) | 449 MAD (≈ -33 %) |
| Catégorie / type | Soins bucco-dentaires |
| Vendeur | Denti Luxe |
| SKU | DENTI-LUXE-HYDRO |
| Photos | product1/2/3.png (uploadées sur le CDN Shopify) |
| Tags | Hydropulseur, Soins bucco-dentaires, Paiement à la livraison, COD, Facettes, Sans fil, Maroc |
| GID | `gid://shopify/Product/9380341579995` |

Description vendeuse (bénéfices, mode d'emploi, garanties, FAQ) reprise de la page
de vente `src/shop/Shop.jsx`, orientée paiement à la livraison + facettes/gencives.

### Paiement à la livraison (COD)
✅ Activé (moyen de paiement manuel « Paiement à la livraison (COD) »).

### Publication du produit sur le canal « Boutique en ligne »
✅ Publié sur les canaux **Boutique en ligne** et **Point de vente**
(`publishablePublish`). Sans ça, la boutique affichait « No products found » et
des cartes produit fictives.

## 2. Thème navy / or

Palette appliquée (skill `ui-ux-pro-max`, voir `design-system/denti-luxe/`) :

- **Fond (background)** : `#0B1320` — navy profond
- **Premier plan (foreground)** : `#CBAA6A` — or
- Boutons primaires : or sur navy · Badge promo : or · Sold-out : `#16203A`
- Contraste or/navy ≈ 7.6:1 (WCAG AA ✓)

Appliquée sur une **copie du thème** : **« Denti Luxe — Navy & Or »**
(`gid://shopify/OnlineStoreTheme/162658713819`, statut UNPUBLISHED).

### Publication — action manuelle requise
La publication de thème est bloquée via l'API pour sécurité. Pour activer le thème :
**Shopify Admin → Boutique en ligne → Thèmes → … → Publier**
(prévisualisez d'abord pour valider le rendu navy/or).

## 3. Page d'accueil « landing » navy/or

Construite sur le thème **« Denti Luxe — Navy & Or (Accueil) »**
(`gid://shopify/OnlineStoreTheme/162659631323`, UNPUBLISHED).
Template sauvegardé dans `shopify-theme/templates/index.json`.

Structure (3 sections, toutes navy/or) :
1. **Hero principal** — image produit + dégradé navy, sur-titre or « OFFRE DE LANCEMENT ·
   PAIEMENT À LA LIVRAISON », H1 blanc « Un sourire propre et sain, comme chez le dentiste »,
   sous-titre, **CTA or « Commander — 299 DH au lieu de 449 »** → fiche produit.
2. **Section produit** — « Découvrez l'Hydropulseur Denti Luxe » + carte produit (prix barré).
3. **Hero de clôture (réassurance)** — badges or COD / livraison 24–72h / satisfait ou remboursé,
   H2 « Prêt à retrouver un sourire éclatant ? », **CTA « Je commande maintenant »**.

### Pour mettre en ligne cette page d'accueil
**Admin → Boutique en ligne → Thèmes → « Denti Luxe — Navy & Or (Accueil) » → Prévisualiser → Publier.**
C'est ce thème (et non la version sans page d'accueil) qu'il faut publier pour avoir
à la fois le palette navy/or **et** la landing produit. Les anciens thèmes peuvent ensuite
être supprimés.

## 4. Corrections après recette (vidéo de prévisualisation)

- **Produit invisible** → publié sur les canaux Boutique en ligne + Point de vente.
- **CTA non cliquables visuellement** : `style_class` valait `"button-primary"`
  (invalide pour Horizon) → rendu en simple texte. Valeurs valides : `button`
  (primaire), `button-secondary`, `button-unstyled`, `button-custom`.
  Corrigé en `"button"` (bouton or plein, texte navy).
- Correctif appliqué sur le thème **« Denti Luxe — Navy & Or v2 »**
  (`gid://shopify/OnlineStoreTheme/162660024539`, UNPUBLISHED) → **à publier**.

### Astuce : éviter de republier
Le correctif bouton peut aussi se faire en 30 s dans l'éditeur du thème **déjà en
ligne** : Personnaliser → cliquer chaque bouton CTA (hero + bandeau de clôture)
→ Style → **Primaire**. Pas besoin de republier dans ce cas.

## 5. Refonte premium — page d'accueil sur-mesure

Section custom **`sections/denti-landing.liquid`** (HTML/CSS maison, scoped `.dl`,
navy/or) qui remplace les blocs Horizon génériques. Contenu :
- Bandeau d'annonce · Hero produit (image + prix dynamique {{ product }} + bouton
  **Commander** qui ajoute au panier et va droit au **checkout COD**)
- Bandeau de stats (3 370+ / 4.9/5 / +1 200)
- Grille de bénéfices (4 cartes + icônes SVG), « Comment ça marche » (3 étapes)
- Avis clients (3), garanties, FAQ accordéon natif, CTA final
- Responsive (desktop 2 colonnes → mobile 1 colonne), data produit en Liquid.

`templates/index.json` ne charge plus que cette section.
Construit sur le thème **« Denti Luxe — Premium »**
(`gid://shopify/OnlineStoreTheme/162660384987`, UNPUBLISHED) → **à publier**.

## 6. Logo + langue FR + animations 3D + autres pages

- **Logo** uploadé dans Files (`shopify://shop_images/denti-luxe-logo.png`), défini
  dans le header (`config/settings_data.json` → `logo`) et affiché dans le hero de la landing.
- **Français** : langue FR activée et publiée ; menu traduit (Accueil / Boutique /
  Contact) ; littéraux traduits (bandeau « Bienvenue chez Denti Luxe », Panier,
  « Vous aimerez aussi », « Tout voir », « Envoyer »).
- **Animations 3D** (section landing) : tilt 3D de l'image produit au survol (suivi
  souris), médaillon −% en rotation 3D, logo flottant, cartes bénéfices en relief 3D
  au survol, apparition au scroll (IntersectionObserver). `prefers-reduced-motion` respecté.
- **Autres pages** : header (logo + annonce FR), panier (FR), contact (FR).
- Tout sur le thème **« Denti Luxe — Premium v2 »**
  (`gid://shopify/OnlineStoreTheme/162660778203`, UNPUBLISHED) → **à publier**.

> Pour une boutique 100 % FR par défaut : Admin → Paramètres → Langues → définir
> **Français** comme langue par défaut (les libellés système comme « Add to cart »
> basculent alors automatiquement via `locales/fr.json`).

## 7. Page d'accueil « 10 000 € » — thème « Denti Luxe — Signature »

Refonte finale, qualité agence (navy profond + or, typo Playfair Display + DM Sans,
animations 3D : tilt souris sur le visuel produit, médaillon −% en rotation, logo
flottant, cartes en relief au survol, apparition au scroll via IntersectionObserver,
`prefers-reduced-motion` respecté).

Thème **« Denti Luxe — Signature »**
(`gid://shopify/OnlineStoreTheme/162689188059`, UNPUBLISHED) → **à publier**.

Fichiers en place sur le thème (vérifiés via l'API) :
- `sections/denti-landing.liquid` (≈ 21,9 Ko) — section **autonome** : tout le CSS et
  le JS sont inline dans la section (scoped `#dl-{{ section.id }}`), donc aucune
  dépendance externe. Hero produit (prix dynamique `{{ product }}`, bouton **Commander**
  → ajout panier + `return_to=/checkout` pour aller droit au **paiement à la livraison**),
  bandeau d'annonce, stats, 4 bénéfices, « Comment ça marche », 3 avis, garanties,
  FAQ (accordéon natif), CTA final. Responsive 2 col → 1 col.
- `templates/index.json` — ne charge que la section `denti-landing`.
- `assets/denti-a.css`, `assets/denti-b.css`, `assets/denti-landing.js` — version
  *splittée* du même design (uploadée pour fiabilité), **non requise** par la section
  autonome ci-dessus mais conservée sans effet de bord.

### Mise en ligne (action manuelle)
**Admin → Boutique en ligne → Thèmes → « Denti Luxe — Signature » →
Prévisualiser** (valider le rendu) **→ Publier.**
Une fois publié, les anciens thèmes brouillon (Navy & Or, Premium v1/v2/v3…)
peuvent être supprimés pour ne garder que **Signature**.

### Reste à faire côté Admin (non automatisable par l'API)
- **Pages politiques** : coller les 4 politiques + la **mention légale** dans
  Paramètres → Politiques (texte prêt dans `scratchpad/politiques-denti-luxe.txt` ;
  l'API bloque l'écriture des politiques officielles faute du scope
  `write_legal_policies`).
- Optionnel : définir **Français** comme langue par défaut (cf. §6).

## 8. Page produit sur-mesure — thème « Signature »

Nouvelle page produit premium (même thème **Signature**,
`gid://shopify/OnlineStoreTheme/162689188059`), cohérente navy/or avec l'accueil.

Fichiers ajoutés (vérifiés via l'API) :
- `sections/denti-product.liquid` (≈ 22,9 Ko) — section **autonome** (CSS + JS inline,
  scoped `#dlp-{{ section.id }}`). Utilise l'objet `{{ product }}` du template, donc
  zéro valeur en dur :
  - **Galerie** : grande image + miniatures cliquables (swap JS), badge −% , zoom au survol.
  - **Buy box** : fil d'Ariane, titre, étoiles 4.9/5, prix + prix barré + « Économisez X »,
    chips (3 modes / IPX7 / USB / sans fil), bouton **Commander → ajout panier +
    `return_to=/checkout`** (paiement à la livraison direct), réassurance COD / livraison / retour.
  - Bénéfices (4), **Caractéristiques** (tableau), **Description** (rendu `product.description`),
    avis (3), FAQ accordéon, CTA final, **barre d'achat collante mobile**.
  - Responsive 2 col → 1 col, apparition au scroll, `prefers-reduced-motion` respecté.
- `templates/product.json` — ne charge que la section `denti-product` pour **toutes** les
  fiches produit.

Upload réalisé via **staged upload** (fichier poussé sur le CDN Shopify puis référencé
par URL dans `themeFilesUpsert`) pour éviter les coupures de flux sur les gros fichiers.

### Mise en ligne
Inclus automatiquement dès que tu **publies le thème « Denti Luxe — Signature »**
(Admin → Thèmes → Prévisualiser → Publier). L'accueil **et** la page produit
deviennent premium en une seule publication.
