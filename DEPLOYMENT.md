# Deployment-Anleitung: Vercel + Hostinger DNS

## Schritt 1: Vercel-Account und Projekt

### Option A: Bestehendes Vercel-Konto (wenn Leaderboard dort läuft)
1. Gehe zu vercel.com → Dashboard
2. "Add New" → "Project"
3. Importiere das Git-Repo (GitHub oder direkt per CLI)

### Option B: Neues Vercel-Konto
1. Gehe zu vercel.com → Sign Up (am besten mit GitHub)
2. "Add New" → "Project"
3. Verbinde dein GitHub-Repo

### Vercel CLI (Alternative ohne GitHub)
```bash
npm i -g vercel
cd muenster-karte
vercel login
vercel --prod
```

## Schritt 2: Subdomain in Vercel konfigurieren

1. Im Vercel Dashboard → Dein Projekt → "Settings" → "Domains"
2. Füge hinzu: `karte.teigelerundpartner.de`
3. Vercel zeigt dir einen CNAME-Wert an (normalerweise `cname.vercel-dns.com`)

## Schritt 3: DNS-Record bei Hostinger setzen

1. Logge dich bei Hostinger ein
2. Gehe zu: Domains → teigelerundpartner.de → DNS Zone
3. Füge einen neuen Record hinzu:
   - **Typ:** CNAME
   - **Name:** karte
   - **Ziel/Value:** cname.vercel-dns.com
   - **TTL:** 14400 (oder Standard)
4. Speichern

**Propagation dauert 5-30 Minuten.** Danach ist karte.teigelerundpartner.de erreichbar.

## Schritt 4: SSL-Zertifikat

Vercel erstellt automatisch ein Let's Encrypt SSL-Zertifikat für die Subdomain. Passiert automatisch nach der DNS-Propagation. Keine Aktion nötig.

## Schritt 5: Verifizieren

1. Warte 10-30 Minuten nach DNS-Änderung
2. Öffne: https://karte.teigelerundpartner.de
3. Prüfe: Grünes Schloss (SSL), App lädt korrekt

## Schritt 6: Iframe in WordPress einbetten

In Elementor auf der Zielseite (z.B. Slug: immobilienpreise-muenster):

1. Neuen "HTML"-Widget in die Karten-Sektion ziehen
2. Folgenden Code einfügen:

```html
<div style="width:100%;position:relative;">
  <iframe 
    id="tp-stadtteilkarte"
    src="https://karte.teigelerundpartner.de" 
    style="width:100%;border:none;min-height:700px;"
    loading="lazy"
    title="Interaktive Stadtteil-Karte Münster mit Immobilienpreisen"
    allow="fullscreen"
  ></iframe>
</div>

<script>
// Automatische Höhenanpassung
window.addEventListener('message', function(e) {
  if (e.origin === 'https://karte.teigelerundpartner.de' && e.data.type === 'resize') {
    document.getElementById('tp-stadtteilkarte').style.height = e.data.height + 'px';
  }
});
</script>
```

## Quartalsweise Daten-Aktualisierung

1. Öffne `src/data/districts.json`
2. Aktualisiere die Preise in den `prices`-Objekten
3. Aktualisiere `meta.lastUpdated` und `meta.quarter`
4. Git commit + push → Vercel deployed automatisch (ca. 30 Sekunden)

## Troubleshooting

**Subdomain nicht erreichbar:**
- DNS-Propagation kann bis zu 48h dauern (selten)
- Prüfe den CNAME-Record: `dig karte.teigelerundpartner.de CNAME`
- In Vercel: Domain-Status muss "Valid Configuration" zeigen

**Iframe zeigt nichts:**
- Browser-Konsole prüfen (F12)
- CORS-Headers in vercel.json müssen teigelerundpartner.de erlauben
- Prüfe ob die Iframe-URL korrekt ist (https, nicht http)

**SSL-Fehler:**
- Vercel braucht manchmal 10 Min für das Zertifikat
- Falls nach 1h kein SSL: In Vercel Domain entfernen und neu hinzufügen
