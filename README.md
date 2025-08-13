# Dominik Maier - Coaching & Interim Management

**Strategische Unternehmensentwicklung und Interim Management aus dem Schwarzwald**

Moderne, SEO-optimierte Business-Website mit Enhanced Statistics, E-Mail-Integration und PWA-Features

## 🚀 Aktueller Status (August 2025)

### ✅ **Vollständig funktional:**
- **E-Mail-System v18.3.8** ✅ Strato SMTP Integration
- **Enhanced Statistics** ✅ Vollständige Business Intelligence
- **Blog-System v1.0** ✅ SEO-optimierte Content-Plattform
- **Service-Seiten** ✅ Alle 4 Hauptservices integriert
- **PWA-Features** ✅ Service Worker + Manifest
- **Header v1.7.4** ✅ Minimale Navigation ohne Toggle-Duplikate

## 🛠️ Technologie-Stack

| Technologie | Version | Zweck |
|---|---|---|
| **Astro** | 4.x | Static Site Generator |
| **TailwindCSS** | 3.x | Utility-First CSS Framework |
| **JavaScript** | ES2023 | Interaktivität & API-Calls |
| **Nodemailer** | Latest | E-Mail-Versendung (Strato SMTP) |
| **AOS** | 2.3.4 | Scroll-Animationen |
| **PWA Detection** | v1.3.1 | Automatische Layout-Optimierung |

## 📊 Business Intelligence Features

### ✅ **E-Mail-System (v18.3.8)**
- Echte SMTP-Integration über Strato
- Automatische Bestätigungs-E-Mails für Leads
- Admin-Benachrichtigungen mit Lead-Priorisierung
- Fallback-System bei SMTP-Fehlern
- Corporate Design HTML + Text Templates

### ✅ **Enhanced Statistics**
- Lead-Tracking mit IP-Adresse und User-Agent
- Service-Performance Analyse
- Device-Detection (Mobile/Desktop/Tablet)
- Peak-Time Analytics für Marketing-Optimierung
- Conversion-Tracking Blog → Lead

## 🎨 Design-System

### ✅ **Layout v1.2.8 (NIEMALS ÄNDERN)**
- Responsive Design für alle Geräte
- Dark/Light Mode mit Theme-Toggle
- Moderne Animationen mit AOS
- Accessibility WCAG 2.1 AA konform
- Performance optimiert (Core Web Vitals)

### ✅ **Header v1.7.4 - Minimale Navigation**
- **Nur 185 Zeilen Code** (37% Reduzierung von v1.7.3)
- Logo + Desktop Navigation
- Service-Dropdown mit korrekten `/leistung/` Pfaden
- Mobile Menu + Services Accordion
- **Keine Toggle-Duplikate** - PWA-System übernimmt Layout-Control

### ✅ **PWA-Features**
- **PWA Detection v1.3.1** - Automatische Desktop-Mode Aktivierung
- Service Worker für Offline-Funktionalität
- App-Installation auf Mobile & Desktop
- Optimierte Performance und Caching

## 📁 Projektstruktur

```
📁 src/pages/
├── 🏠 index.astro (Homepage v1.3.11)
├── ☎️ kontakt.astro (Kontakt-Seite)
├── 👤 ueber-mich.astro (Über Mich v1.1.5)
├── 📄 blog.astro (Blog-Übersicht v1.0)
├── 🎨 logo-showcase.astro (Logo-Sammlung v2.0)
├── 📋 impressum.astro (Impressum v3.1)
├── 🔒 datenschutz.astro (Datenschutz v3.1.1)
└── 📁 leistung/
    ├── strategische-unternehmensentwicklung.astro v1.1.1
    ├── vertriebsoptimierung.astro v1.1
    ├── marketing-strategien.astro v1.1
    └── wertanalyse.astro v1.1
```

## 🚀 Installation & Entwicklung

### **Voraussetzungen:**
- Node.js ≥ 18.0
- npm oder yarn
- Git

### **Setup:**
```bash
git clone https://github.com/DomMa84/DMCoaching.git
cd DMCoaching
npm install
cp .env.example .env
npm run dev
# → http://localhost:4321
```

### **Environment Variables:**
```bash
# Strato SMTP Configuration (v18.3.8)
EMAIL_HOST=smtp.strato.de
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=maier@maier-value.com
EMAIL_PASSWORD=your_strato_password
EMAIL_FROM=maier@maier-value.com
EMAIL_TO=maier@maier-value.com

# Business Configuration
BUSINESS_NAME="Dominik Maier Coaching & Interim Management"
BUSINESS_ADDRESS="Gaisbachweg 4, 77776 Bad Rippoldsau"
BUSINESS_PHONE="+49 7440 913367"

# Development Settings
NODE_ENV=production
SITE_URL=https://maier-value.com
```

## 📊 Analytics & Tracking

Das System erfasst automatisch:

| Metrik | Beschreibung | Verwendung |
|---|---|---|
| **Lead-Quelle** | Welche Seite führte zum Kontakt | Marketing-ROI |
| **Device-Type** | Mobile/Desktop/Tablet | UX-Optimierung |
| **Peak-Times** | Aktivste Uhrzeiten | E-Mail-Timing |
| **Service-Interest** | Interesse an Services | Angebots-Fokus |
| **Geographic Data** | IP-basierte Region | Local SEO |

**Admin Dashboard:** https://maier-value.com/admin

## 🌐 Deployment

### **Netlify (Automatisch)**
- GitHub Push triggert automatisches Deployment
- **Build Command:** `npm run build`
- **Publish Directory:** `dist/`
- Environment Variables in Netlify Dashboard setzen

### **Build Commands:**
```bash
npm run build
npm run preview # Lokale Vorschau
```

## 📧 E-Mail-System

### **Features:**
- ✅ Input-Validierung (Name, E-Mail, Telefon)
- ✅ Spam-Schutz mit Rate-Limiting
- ✅ Dual E-Mail-System (User + Admin)
- ✅ Enhanced Statistics Integration
- ✅ Error-Handling mit Fallbacks

### **Response Format:**
```json
{
  "success": true,
  "message": "E-Mail erfolgreich versendet",
  "messageId": "strato-queue-id-12345",
  "leadId": "contact_20250804_001"
}
```

## 🔍 SEO-Optimierung

### **Technical SEO:**
- Core Web Vitals optimiert
- Schema Markup (Organization, LocalBusiness, Person)
- XML Sitemap automatisch generiert
- Robots.txt konfiguriert
- Meta-Tags für alle Seiten

### **Local SEO:**
- Google My Business Integration vorbereitet
- Bad Rippoldsau Geo-Targeting
- Schwarzwald Regional-Keywords
- Baden-Württemberg Service-Area

### **Content SEO:**
- Blog-System für regelmäßigen Content
- Keyword-Strategie für Interim Management
- Internal Linking zwischen Services
- Long-tail Keywords für Nischenzielgruppen

## 📈 Performance

### **Aktuelle Scores:**
- **Desktop:** 95+ Score
- **Mobile:** 90+ Score
- **Core Web Vitals:** Alle grün
- **Accessibility:** 100 Score

### **Business KPIs:**
- **Lead-Conversion:** >3% (Blog → Kontakt)
- **E-Mail-Delivery:** >98% Success Rate
- **Mobile Traffic:** >60% aller Besucher
- **Local Search:** Top 3 für "Interim Management Schwarzwald"

## 🔒 Sicherheit

### **Implementierte Maßnahmen:**
- Content Security Policy (CSP)
- HTTPS enforced (Strict-Transport-Security)
- Input-Sanitization bei Formularen
- Rate-Limiting für API-Endpoints
- Environment Variables für sensible Daten

## 🛠️ Debugging

### **Häufige Probleme:**

**E-Mail funktioniert nicht:**
```bash
# 1. SMTP-Konfiguration prüfen
# 2. Strato-Credentials validieren
# 3. Firewall/Port 465 prüfen
# 4. Logs in Netlify Functions checken
```

**Build-Fehler:**
```bash
# Layout v1.2.8 verwendet - NICHT ändern
# Tailwind-Classes ohne Escape-Sequences
# npm run build && npm run preview testen
```

**ContactForm Probleme:**
```bash
# ContactForm v18.10.4 prüfen
# API-Endpoint /api/contact.js testen
# Environment Variables vollständig?
```

## 👥 Team & Kontakt

### **Projektleitung:** Dominik Maier
- **Tech-Stack:** Astro + Tailwind + Netlify
- **Development:** GitHub + Netlify
- **Support:** Claude Sonnet 4

### **Kontakt:**
- **E-Mail:** [maier@maier-value.com](mailto:maier@maier-value.com)
- **Telefon:** +49 7440 913367
- **Standort:** Bad Rippoldsau, Schwarzwald
- **Website:** [https://maier-value.com](https://maier-value.com)

## 🎯 Roadmap

### **✅ ABGESCHLOSSEN:**
- ✅ E-Mail-System v18.3.8 reaktiviert
- ✅ Enhanced Statistics implementiert
- ✅ Blog-System v1.0 live
- ✅ Service-Seiten vollständig
- ✅ Header v1.7.4 minimiert
- ✅ PWA-Features implementiert

### **🔄 IN ARBEIT:**
- 🔄 Mobile Dropdown Funktionalität reparieren
- 🔄 Theme Toggle in PWA-System integrieren
- 🔄 Google My Business Optimierung
- 🔄 Local SEO Bad Rippoldsau/Schwarzwald

### **🎯 GEPLANT:**
- 🎯 Blog-Content-Strategie (KI + Interim Management)
- 🎯 Lead-Magnets (PDF-Guides) implementieren
- 🎯 Multi-Language Support (EN)
- 🎯 Advanced Analytics Dashboard
- 🎯 Appointment-Booking-System
- 🎯 Client-Portal für Interim-Projekte

## 📄 Lizenz

Alle Rechte vorbehalten. © 2025 Dominik Maier

Dieses Projekt ist proprietär und nicht für die öffentliche Nutzung bestimmt. Alle Inhalte, Designs und Code-Komponenten sind Eigentum von Dominik Maier Coaching & Interim Management.

## 🔗 Links

- **Hosting:** [Netlify](https://netlify.com)
- **Domain:** [Strato](https://strato.de)
- **Framework:** [Astro](https://astro.build)
- **CSS:** [TailwindCSS](https://tailwindcss.com)
- **Animations:** [AOS Library](https://michalsnik.github.io/aos/)

---

**Letztes Update:** August 2025 | Version 1.7.4 | Status: ✅ Produktiv
