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

### Paiement à la livraison (COD) — action manuelle requise
Le COD est une **méthode de paiement au niveau de la boutique**, pas un attribut produit.
À activer dans **Shopify Admin → Paramètres → Paiements → Paiement à la livraison (Cash on Delivery)**.
Le produit est déjà tagué et sa description annonce le paiement à la livraison.

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
**Shopify Admin → Boutique en ligne → Thèmes → « Denti Luxe — Navy & Or » → Publier**
(prévisualisez d'abord pour valider le rendu navy/or).
