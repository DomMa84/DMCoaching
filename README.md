# 🎯 Dominik Maier Coaching Website v2.29

> **Strategische Unternehmensentwicklung und Interim Management aus dem Schwarzwald**  
> Moderne, SEO-optimierte Business-Website mit Enhanced Statistics und E-Mail-Integration

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)
[![Built with Astro](https://img.shields.io/badge/Built_with-Astro-ff5d01.svg)](https://astro.build)
[![Hosted on Netlify](https://img.shields.io/badge/Hosted_on-Netlify-00c7b7.svg)](https://netlify.com)

## 🌟 **Aktueller Status (August 2025)**

### ✅ **VOLLSTÄNDIG FUNKTIONAL**
- **E-Mail-System v18.3.8** ✅ Strato SMTP Integration 
- **Enhanced Statistics** ✅ Vollständige Business Intelligence
- **Blog-System v1.0** ✅ SEO-optimierte Content-Plattform
- **Service-Seiten** ✅ Alle 4 Hauptservices integriert
- **Layout v1.2.8** ✅ Netlify-kompatible CSS-Syntax

---

## 🏗️ **Tech Stack**

| Technologie | Version | Zweck |
|-------------|---------|--------|
| **Astro** | 4.x | Static Site Generator |
| **TailwindCSS** | 3.x | Utility-First CSS Framework |
| **JavaScript** | ES2023 | Interaktivität & API-Calls |
| **Nodemailer** | Latest | E-Mail-Versendung (Strato SMTP) |
| **AOS** | 2.3.4 | Scroll-Animationen |
| **Netlify** | - | Hosting & Deployment |
| **GitHub** | - | Versionskontrolle |
| **Bolt.new** | - | Development Environment |

---

## 🚀 **Hauptfeatures**

### 📧 **E-Mail-System v18.3.8**
- **Echte SMTP-Integration** über Strato
- **Automatische Bestätigungs-E-Mails** für Leads
- **Admin-Benachrichtigungen** mit Lead-Priorisierung
- **Fallback-System** bei SMTP-Fehlern
- **Corporate Design** HTML + Text Templates

### 📊 **Enhanced Statistics System**
- **Lead-Tracking** mit IP-Adresse und User-Agent
- **Service-Performance** Analyse
- **Device-Detection** (Mobile/Desktop/Tablet)
- **Peak-Time Analytics** für Marketing-Optimierung
- **Conversion-Tracking** Blog → Lead

### 🎨 **Design & UX**
- **Responsive Design** für alle Geräte
- **Dark/Light Mode** mit Theme-Toggle
- **Moderne Animationen** mit AOS
- **Accessibility** WCAG 2.1 AA konform
- **Performance** optimiert (Core Web Vitals)

### 📝 **Content Management**
- **Blog-System** für SEO-Content
- **Service-Seiten** für alle Leistungen
- **Logo-Showcase** mit Brand Guidelines
- **Rechtliche Seiten** (Datenschutz, Impressum)

---

## 🏠 **Seitenstruktur**

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

---

## ⚙️ **Installation & Setup**

### **Voraussetzungen**
- Node.js ≥ 18.0
- npm oder yarn
- Git

### **1. Repository klonen**
```bash
git clone https://github.com/DomMa84/DMCoaching.git
cd DMCoaching
```

### **2. Dependencies installieren**
```bash
npm install
```

### **3. Environment-Variablen konfigurieren**
```bash
cp .env.example .env
```

### **4. Development Server starten**
```bash
npm run dev
# → http://localhost:4321
```

---

## 🔧 **Environment-Konfiguration**

### **.env Datei:**
```env
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

---

## 📊 **Enhanced Statistics Dashboard**

Das System erfasst automatisch:

| Metrik | Beschreibung | Verwendung |
|--------|--------------|------------|
| **Lead-Quelle** | Welche Seite führte zum Kontakt | Marketing-ROI |
| **Device-Type** | Mobile/Desktop/Tablet | UX-Optimierung |
| **Peak-Times** | Aktivste Uhrzeiten | E-Mail-Timing |
| **Service-Interest** | Interesse an Services | Angebots-Fokus |
| **Geographic Data** | IP-basierte Region | Local SEO |

### **Zugriff auf Statistics:**
```
https://maier-value.com/admin
```

---

## 🚀 **Deployment**

### **Netlify (Aktuell)**
1. **GitHub** Push triggert automatisches Deployment
2. **Build Command:** `npm run build`
3. **Publish Directory:** `dist/`
4. **Environment Variables** in Netlify Dashboard setzen

### **Build für Produktion:**
```bash
npm run build
npm run preview  # Lokale Vorschau
```

---

## 📱 **Kontaktformular API**

### **Endpoint:** `/api/contact.js`

**Features:**
- ✅ **Input-Validierung** (Name, E-Mail, Telefon)
- ✅ **Spam-Schutz** mit Rate-Limiting
- ✅ **Dual E-Mail-System** (User + Admin)
- ✅ **Enhanced Statistics** Integration
- ✅ **Error-Handling** mit Fallbacks

**Response Format:**
```json
{
  "success": true,
  "message": "E-Mail erfolgreich versendet",
  "messageId": "strato-queue-id-12345",
  "leadId": "contact_20250804_001"
}
```

---

## 🎯 **SEO-Optimierungen**

### ✅ **Technical SEO**
- **Core Web Vitals** optimiert
- **Schema Markup** (Organization, LocalBusiness, Person)
- **XML Sitemap** automatisch generiert
- **Robots.txt** konfiguriert
- **Meta-Tags** für alle Seiten

### ✅ **Local SEO**
- **Google My Business** Integration vorbereitet
- **Bad Rippoldsau** Geo-Targeting
- **Schwarzwald** Regional-Keywords
- **Baden-Württemberg** Service-Area

### ✅ **Content SEO**
- **Blog-System** für regelmäßigen Content
- **Keyword-Strategie** für Interim Management
- **Internal Linking** zwischen Services
- **Long-tail Keywords** für Nischenzielgruppen

---

## 🔄 **Versionierung & Changelog**

### **Aktuelle Versionen:**
- **Layout.astro:** v1.2.8 (NIEMALS ÄNDERN - Netlify-kompatibel)
- **ContactForm.astro:** v18.10.4 (Enhanced Statistics)
- **Header.astro:** v1.5.2 (Blog-Navigation + Service-Dropdown)
- **Footer.astro:** v1.3 (Theme Toggle synchron)

### **Wichtige Regeln:**
1. **IMMER** mit Versionsnummern arbeiten
2. **Layout v1.2.8** niemals ändern (CSS-Syntax Netlify-kompatibel)
3. **Changelog** in jeder Datei dokumentieren
4. **E-Mail-System v18.3.8** ist stabil - nicht modifizieren

---

## 🏆 **Performance Metriken**

### **PageSpeed Insights Ziele:**
- **Desktop:** 95+ Score
- **Mobile:** 90+ Score
- **Core Web Vitals:** Alle grün
- **Accessibility:** 100 Score

### **Business KPIs:**
- **Lead-Conversion:** >3% (Blog → Kontakt)
- **E-Mail-Delivery:** >98% Success Rate
- **Mobile Traffic:** >60% aller Besucher
- **Local Search:** Top 3 für "Interim Management Schwarzwald"

---

## 🔐 **Sicherheit**

### **Implementierte Maßnahmen:**
- **Content Security Policy** (CSP)
- **HTTPS** enforced (Strict-Transport-Security)
- **Input-Sanitization** bei Formularen
- **Rate-Limiting** für API-Endpoints
- **Environment Variables** für sensible Daten

---

## 🐛 **Troubleshooting**

### **Häufige Probleme:**

#### **E-Mail wird nicht versendet**
```bash
# 1. SMTP-Konfiguration prüfen
# 2. Strato-Credentials validieren  
# 3. Firewall/Port 465 prüfen
# 4. Logs in Netlify Functions checken
```

#### **CSS lädt nicht korrekt**
```bash
# Layout v1.2.8 verwendet - NICHT ändern
# Tailwind-Classes ohne Escape-Sequences
# npm run build && npm run preview testen
```

#### **Statistics funktionieren nicht**
```bash
# ContactForm v18.10.4 prüfen
# API-Endpoint /api/contact.js testen
# Environment Variables vollständig?
```

---

## 👥 **Team & Kontakt**

### **Entwicklung:**
- **Projektleitung:** Dominik Maier
- **Tech-Stack:** Astro + Tailwind + Netlify
- **Development:** Bolt.new Environment
- **Support:** claude-sonnet-4

### **Business-Kontakt:**
- **E-Mail:** maier@maier-value.com
- **Telefon:** +49 7440 913367  
- **Standort:** Bad Rippoldsau, Schwarzwald
- **Website:** https://maier-value.com

---

## 📈 **Roadmap 2025**

### **Q3 2025:** ✅ **ABGESCHLOSSEN**
- ✅ E-Mail-System v18.3.8 reaktiviert
- ✅ Enhanced Statistics implementiert
- ✅ Blog-System v1.0 live
- ✅ Service-Seiten vollständig

### **Q4 2025:** 🚧 **IN ARBEIT**
- 🔄 Google My Business Optimierung
- 🔄 Local SEO Bad Rippoldsau/Schwarzwald
- 🔄 Blog-Content-Strategie (KI + Interim Management)
- 🔄 Lead-Magnets (PDF-Guides) implementieren

### **2026:** 📅 **GEPLANT**
- 🎯 Multi-Language Support (EN)
- 🎯 Advanced Analytics Dashboard
- 🎯 Appointment-Booking-System
- 🎯 Client-Portal für Interim-Projekte

---

## 📄 **Lizenz**

**Alle Rechte vorbehalten. © 2025 Dominik Maier**

Dieses Projekt ist proprietär und nicht für die öffentliche Nutzung bestimmt. Alle Inhalte, Designs und Code-Komponenten sind Eigentum von Dominik Maier Coaching & Interim Management.

---

## 🙏 **Credits**

- **Hosting:** [Netlify](https://netlify.com)
- **Domain:** [Strato](https://strato.de)  
- **Framework:** [Astro](https://astro.build)
- **CSS:** [TailwindCSS](https://tailwindcss.com)
- **Animations:** [AOS Library](https://michalsnik.github.io/aos/)
- **Development:** [Bolt.new](https://bolt.new)

---

*Letztes Update: August 2025 | Version 2.29 | Status: ✅ Produktiv*