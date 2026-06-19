# Aṣliḥ Bladi — Fix My Country · أصلح بلادي

A location-verified citizen priority board for Algeria. Citizens confirm they're
on the ground, vote on what the country should fix **first**, and the resulting
ranking becomes a mandate — routed to the government body that can actually act on it.

🌐 **Live:** https://aminmenaa06-ship-it.github.io/fix-my-country-dz/

## What it does

1. **Verify you're a citizen on the ground** — a browser GPS check confirms you're
   inside Algeria's borders (coordinates never leave the page), with a manual
   wilaya fallback for when GPS is unavailable.
2. **Vote on what matters most** — 16 real issues (water, power cuts, youth jobs,
   hospitals, cost of living, corruption, housing, roads, internet, schools,
   transport, waste, paperwork, pollution, women's safety, farming), each bilingual
   (English + Arabic) with a live vote meter.
3. **The people's mandate** — a live national ranking and a downloadable priority
   report.
4. **Reach the people who can fix it** — every issue is mapped to the **ministry
   responsible** for it, plus a three-tier contact directory:
   - **National** — Presidency, Prime Ministry, Ministry of Interior, the Ombudsman
     (Médiateur de la République / Wassit), and the public-services portal.
   - **Wilaya** — your provincial governor (Wali) and assembly (APW).
   - **Commune** — your town hall and elected mayor (P/APC).
   - Plus toll-free **emergency lines** (Police 17, Gendarmerie 1055, Civil
     Protection 14, SAMU 115).

## Tech

Pure static site — HTML, CSS, vanilla JavaScript. No build step, no framework,
no backend. A dark "command-center" theme with a particle-network backdrop.

## Honest limitations (it's a civic prototype)

- **Votes are stored per-browser** (`localStorage`) and do **not** aggregate across
  people — every visitor sees their own tally on top of seeded numbers. Real shared
  voting would need a backend.
- The GPS check uses a **bounding box** of Algeria's borders, not a precise polygon.
- Government contact details are best-available official starting points; a department
  or hotline may route you more precisely.

الشعب يقرر — the people decide the order.
