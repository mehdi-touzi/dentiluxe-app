// Synchronisation cloud (Supabase) — sauvegarde permanente et multi-appareils.
// Renseigne tes 2 cles ci-dessous OU via les variables d'environnement Vercel
// (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Tant que c'est vide, l'app
// fonctionne normalement en stockage local (aucune perte de fonctionnalite).

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Un seul enregistrement partage pour ce compte (app mono-utilisateur).
const ROW_ID = "main";

export const cloudEnabled = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

function headers(extra) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// Recupere l'etat sauvegarde ({rdvs,pubs,goal}) ou null si rien en ligne.
export async function cloudLoad() {
  if (!cloudEnabled) return null;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/app_data?id=eq.${ROW_ID}&select=data`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error("cloudLoad " + res.status);
  const rows = await res.json();
  return rows && rows[0] ? rows[0].data : null;
}

// Ecrit (upsert) l'etat complet en ligne.
export async function cloudSave(data) {
  if (!cloudEnabled) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/app_data`, {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify({
      id: ROW_ID,
      data,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error("cloudSave " + res.status);
}
