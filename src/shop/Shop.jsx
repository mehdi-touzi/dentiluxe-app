import { useState, useMemo } from "react";

/* ============================================================
   CONFIGURATION — modifie ces valeurs facilement
   ============================================================ */
// Numéro WhatsApp qui reçoit les commandes (format international, sans +, sans espaces).
// Exemple Maroc : 2126XXXXXXXX
const WA_NUMBER = "2126XXXXXXXX";

const PRODUCT = {
  name: "Kit Blanchiment Denti Luxe",
  tagline: "Un sourire éclatant en 7 jours, à la maison",
  price: 299,        // prix de vente (DH)
  oldPrice: 499,     // ancien prix barré (DH) — mets 0 pour le masquer
  currency: "DH",
  // Photos : dépose tes images dans le dossier /public puis mets les chemins ici
  // (ex: "/kit1.jpg"). Laisse vide pour afficher un visuel placeholder.
  photos: [],
};

const REVIEWS = [
  { name: "Salma", city: "Rabat", txt: "Résultat visible en 5 jours, mes dents sont vraiment plus blanches. Je recommande à 100% !" },
  { name: "Yassine", city: "Témara", txt: "Facile à utiliser et livraison rapide. Paiement à la livraison, j'ai payé une fois reçu. Top." },
  { name: "Imane", city: "Casablanca", txt: "J'avais peur que ça abîme mes dents mais non, aucune sensibilité. Sourire de star ✨" },
];

/* ============================================================ */

const FONTS = "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700&display=swap');";
const CSS = `${FONTS}
:root{--nv:#090D14;--nv2:#10151E;--nv3:#171D28;--nb:#252D3B;--go:#CBAA6A;--gl:#E6D09A;--tx:#E9EBEF;--dm:#9097A5;--mt:#646D7D;--gn:#33BA86;--rd:#E45A6E;}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
body{background:var(--nv);}
input,select,button,textarea{outline:none;font-family:'DM Sans',sans-serif;}
.wrap{max-width:560px;margin:0 auto;font-family:'DM Sans',sans-serif;color:var(--tx);background:var(--nv);min-height:100vh;padding-bottom:84px;}
.gg{background:linear-gradient(95deg,var(--go),var(--gl));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;background:linear-gradient(180deg,var(--gl),var(--go));color:#16110A;border:none;border-radius:14px;padding:16px;font-weight:800;font-size:16px;cursor:pointer;width:100%;box-shadow:0 6px 20px rgba(203,170,106,0.3);letter-spacing:.2px;transition:transform .12s;}
.btn:active{transform:translateY(1px);}
.btnwa{background:#25D366;color:#04210F;box-shadow:0 6px 20px rgba(37,211,102,0.32);}
.inp{width:100%;background:var(--nv3);border:1px solid var(--nb);border-radius:12px;padding:13px 15px;color:var(--tx);font-size:15px;transition:border-color .15s,box-shadow .15s;}
.inp:focus{border-color:var(--go);box-shadow:0 0 0 3px rgba(203,170,106,0.12);}
.inp::placeholder{color:var(--mt);}
.card{background:var(--nv2);border:1px solid var(--nb);border-radius:16px;padding:16px;}
.sticky{position:fixed;bottom:0;left:0;right:0;z-index:50;background:rgba(9,13,20,0.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid var(--nb);padding:12px 16px calc(12px + env(safe-area-inset-bottom));}
.sticky .in{max-width:560px;margin:0 auto;display:flex;align-items:center;gap:12px;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.55;}}
.dot{width:7px;height:7px;border-radius:50%;background:var(--gn);animation:pulse 1.6s infinite;}
svg{display:block;}`;

const PATHS = {
  star: 'M12 2l2.9 6.3L22 9.3l-5 4.7 1.2 6.8L12 17.6 5.8 20.8 7 14 2 9.3l7.1-1z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  truck: 'M3 6h11v9H3zM14 9h4l3 3v3h-7zM7 18a2 2 0 1 0 0 .01M17 18a2 2 0 1 0 0 .01',
  cash: 'M2 6h20v12H2zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6M5 9v.01M19 15v.01',
  smile: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M8 14s1.5 2 4 2 4-2 4-2M9 9v.01M15 9v.01',
  spark: 'M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z',
  check: 'M20 6L9 17l-4-4',
  wa: 'M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  tooth: 'M7 3C4.8 3 3.5 4.8 3.7 7.4c.3 3.4 1 5 1.6 8.6.3 1.7.6 4 1.7 4 .9 0 1-1.7 1.3-3.4.3-1.6.5-2.6 1.7-2.6s1.4 1 1.7 2.6c.3 1.7.4 3.4 1.3 3.4 1.1 0 1.4-2.3 1.7-4 .6-3.6 1.3-5.2 1.6-8.6C20.5 4.8 19.2 3 17 3c-1.8 0-2.8 1-5 1S8.8 3 7 3z',
};
function Ic({ n, s = 18, sw = 1.9, fill = "none", style }) {
  const d = PATHS[n]; if (!d) return null;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}><path d={d} /></svg>;
}
function Stars({ s = 14 }) {
  return <span style={{ display: "inline-flex", gap: 2, color: "var(--go)" }}>{[0, 1, 2, 3, 4].map(i => <Ic key={i} n="star" s={s} sw={0} fill="currentColor" />)}</span>;
}

export default function Shop() {
  const [qty, setQty] = useState(1);
  const [f, setF] = useState({ name: "", phone: "", city: "" });
  const [err, setErr] = useState("");
  const total = useMemo(() => qty * PRODUCT.price, [qty]);
  const discount = PRODUCT.oldPrice > 0 ? Math.round((1 - PRODUCT.price / PRODUCT.oldPrice) * 100) : 0;

  function order() {
    if (!f.name.trim() || !f.phone.trim() || !f.city.trim()) {
      setErr("Merci de remplir ton nom, ton téléphone et ta ville.");
      document.getElementById("commande")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setErr("");
    const msg =
      `Bonjour Denti Luxe ! 😁 Je veux commander :\n\n` +
      `🦷 ${PRODUCT.name}\n` +
      `Quantité : ${qty}\n` +
      `Total : ${total} ${PRODUCT.currency} (paiement à la livraison)\n\n` +
      `👤 Nom : ${f.name}\n` +
      `📞 Téléphone : ${f.phone}\n` +
      `📍 Ville : ${f.city}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  const benefits = [
    { n: "smile", t: "Dents plus blanches", d: "Jusqu'à plusieurs teintes en moins de 7 jours" },
    { n: "shield", t: "Sans sensibilité", d: "Formule douce, respecte l'émail" },
    { n: "spark", t: "Résultat pro à la maison", d: "Gel + lampe LED, simple à utiliser" },
    { n: "tooth", t: "Signé Denti Luxe", d: "La marque référence du sourire" },
  ];
  const steps = [
    "Applique le gel sur la gouttière",
    "Pose la lampe LED 10–15 min",
    "Rince — souris, c'est tout !",
  ];
  const guarantees = [
    { n: "cash", t: "Paiement à la livraison" },
    { n: "truck", t: "Livraison partout au Maroc" },
    { n: "shield", t: "Satisfait ou remboursé" },
  ];

  return (
    <div className="wrap">
      <style>{CSS}</style>

      {/* Bandeau annonce */}
      <div style={{ background: "linear-gradient(90deg,rgba(203,170,106,0.14),rgba(203,170,106,0.06))", borderBottom: "1px solid var(--nb)", padding: "9px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "var(--gl)" }}>
        <span className="dot" /> Offre de lancement {discount > 0 ? `· -${discount}%` : ""} · Paiement à la livraison
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        {/* En-tête marque */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(155deg,#1B2230,#0E131C)", border: "1px solid rgba(203,170,106,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--go)" }}><Ic n="tooth" s={23} sw={1.7} /></div>
          <div>
            <div className="gg" style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, lineHeight: 1 }}>Denti Luxe</div>
            <div style={{ fontSize: 9, color: "var(--mt)", letterSpacing: 2, textTransform: "uppercase", marginTop: 3 }}>Boutique officielle</div>
          </div>
        </div>

        {/* Hero */}
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>
          {PRODUCT.tagline}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Stars /><span style={{ fontSize: 12, color: "var(--dm)" }}>+1 200 sourires transformés</span>
        </div>

        {/* Visuel produit */}
        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", border: "1px solid var(--nb)", marginBottom: 16, background: "linear-gradient(155deg,#161D2A,#0E131C)", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {PRODUCT.photos.length > 0 ? (
            <img src={PRODUCT.photos[0]} alt={PRODUCT.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ textAlign: "center", color: "var(--mt)", padding: 24 }}>
              <div style={{ color: "var(--go)", marginBottom: 10, display: "flex", justifyContent: "center" }}><Ic n="tooth" s={64} sw={1.3} /></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dm)" }}>{PRODUCT.name}</div>
              <div style={{ fontSize: 11, marginTop: 6 }}>Ajoute tes photos produit dans /public</div>
            </div>
          )}
          {discount > 0 && <div style={{ position: "absolute", top: 12, left: 12, background: "var(--rd)", color: "#fff", fontWeight: 800, fontSize: 13, padding: "5px 11px", borderRadius: 9 }}>-{discount}%</div>}
        </div>

        {/* Prix + CTA */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{PRODUCT.name}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 900 }} className="gg">{PRODUCT.price} {PRODUCT.currency}</span>
            {PRODUCT.oldPrice > 0 && <span style={{ fontSize: 16, color: "var(--mt)", textDecoration: "line-through" }}>{PRODUCT.oldPrice} {PRODUCT.currency}</span>}
          </div>
          <div style={{ fontSize: 12, color: "var(--gn)", fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><Ic n="check" s={14} sw={2.4} /> En stock · Livraison 24–72h</div>
          <a href="#commande" className="btn"><Ic n="wa" s={18} /> Commander maintenant</a>
        </div>

        {/* Bénéfices */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {benefits.map(b => (
            <div key={b.t} className="card" style={{ padding: 14 }}>
              <div style={{ color: "var(--go)", marginBottom: 8 }}><Ic n={b.n} s={22} /></div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{b.t}</div>
              <div style={{ fontSize: 11, color: "var(--dm)", lineHeight: 1.5 }}>{b.d}</div>
            </div>
          ))}
        </div>

        {/* Comment ça marche */}
        <div className="card" style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Comment ça marche</div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < steps.length - 1 ? 12 : 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(203,170,106,0.12)", color: "var(--go)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: "var(--tx)" }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Avis */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>Ils ont adopté Denti Luxe <Stars s={13} /></div>
          {REVIEWS.map((r, i) => (
            <div key={i} className="card" style={{ marginBottom: 10, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(203,170,106,0.12)", color: "var(--go)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{r.name[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name} <span style={{ color: "var(--gn)", fontSize: 11, fontWeight: 600 }}>· Achat vérifié</span></div>
                  <div style={{ fontSize: 11, color: "var(--mt)" }}>{r.city}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--dm)", lineHeight: 1.6 }}>« {r.txt} »</div>
            </div>
          ))}
        </div>

        {/* Garanties */}
        <div className="card" style={{ marginBottom: 18, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {guarantees.map(g => (
            <div key={g.t} style={{ textAlign: "center" }}>
              <div style={{ color: "var(--go)", display: "flex", justifyContent: "center", marginBottom: 7 }}><Ic n={g.n} s={22} /></div>
              <div style={{ fontSize: 11, color: "var(--dm)", lineHeight: 1.4 }}>{g.t}</div>
            </div>
          ))}
        </div>

        {/* Formulaire de commande */}
        <div id="commande" className="card" style={{ marginBottom: 18, border: "1px solid rgba(203,170,106,0.35)" }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Commander en 30 secondes</div>
          <div style={{ fontSize: 12, color: "var(--dm)", marginBottom: 16 }}>Tu paies <b style={{ color: "var(--gl)" }}>à la livraison</b>. Remplis et on te recontacte sur WhatsApp.</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <input className="inp" placeholder="Ton nom complet" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
            <input className="inp" type="tel" inputMode="tel" placeholder="Ton numéro de téléphone" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
            <input className="inp" placeholder="Ta ville" value={f.city} onChange={e => setF({ ...f, city: e.target.value })} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--nv3)", border: "1px solid var(--nb)", borderRadius: 12, padding: "8px 12px" }}>
              <span style={{ fontSize: 13, color: "var(--dm)" }}>Quantité</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 30, height: 30, borderRadius: 9, background: "var(--nv2)", border: "1px solid var(--nb)", color: "var(--tx)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n="minus" s={15} sw={2.4} /></button>
                <span style={{ fontSize: 16, fontWeight: 800, minWidth: 18, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 30, height: 30, borderRadius: 9, background: "var(--nv2)", border: "1px solid var(--nb)", color: "var(--tx)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n="plus" s={15} sw={2.4} /></button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 2px" }}>
              <span style={{ fontSize: 13, color: "var(--dm)" }}>Total à payer</span>
              <span style={{ fontSize: 22, fontWeight: 900 }} className="gg">{total} {PRODUCT.currency}</span>
            </div>

            {err && <div style={{ fontSize: 12, color: "var(--rd)", fontWeight: 600 }}>{err}</div>}
            <button className="btn btnwa" onClick={order}><Ic n="wa" s={19} /> Commander sur WhatsApp</button>
            <div style={{ fontSize: 11, color: "var(--mt)", textAlign: "center" }}>Sans engagement · Tu confirmes avant l'envoi</div>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: "var(--mt)", paddingBottom: 8 }}>
          © {new Date().getFullYear()} Denti Luxe · Rabat • Témara
        </div>
      </div>

      {/* CTA collant */}
      <div className="sticky">
        <div className="in">
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1 }} className="gg">{PRODUCT.price} {PRODUCT.currency}</div>
            {PRODUCT.oldPrice > 0 && <div style={{ fontSize: 11, color: "var(--mt)", textDecoration: "line-through" }}>{PRODUCT.oldPrice} {PRODUCT.currency}</div>}
          </div>
          <a href="#commande" className="btn" style={{ flex: 1 }}><Ic n="wa" s={18} /> Commander</a>
        </div>
      </div>
    </div>
  );
}
