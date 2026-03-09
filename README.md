<div align="center">

<!-- Banner placeholder — replace with your own -->
![HealthTrend Banner](docs/banner.png)

# 🩸 HealthTrend

**Visualize your blood work history in seconds — private, AI-powered, and entirely in your browser.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Edge_Functions-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Perplexity AI](https://img.shields.io/badge/Perplexity-AI_Powered-1a1a2e?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiBmaWxsPSIjZmZmIi8+PC9zdmc+)](https://www.perplexity.ai)
[![Status](https://img.shields.io/badge/Status-V1_Cloud--synced-brightgreen)](#)

[**🚀 Try the Live Demo →**](https://health-trend.lovable.app)

</div>

---

## ✨ Features

### 📄 Smart PDF Parsing
- **Drag-and-drop upload** — supports multiple lab report PDFs at once
- **In-browser text extraction** via PDF.js — your files never leave your device
- **AI-powered standardization** — normalizes marker names across different labs (Redcliffe, Apollo, Dr. Lal Path, SRL, Thyrocare, Metropolis, and more)
- **Automatic date & lab detection** — extracts report dates, lab names, and patient info

### 📊 Trend Visualization
- **Out-of-range detection** — instantly highlights markers outside normal ranges
- **Worsening trend analysis** — flags markers trending in the wrong direction
- **Sparkline charts** — compact per-marker trend lines powered by Recharts
- **Categorized dashboard** — organized into Out of Range, Worsening, and Normal sections

### 🤖 AI Health Insights
- **Per-marker explanations** — plain-English insights for every biomarker
- **Contextual recommendations** — understand what your results mean and what to discuss with your doctor
- **Powered by Perplexity AI** — via secure backend functions

### 📥 Export & Share
- **PDF export** — generate a comprehensive report with all markers, trends, and insights
- **Floating export nudge** — smart prompts after you've explored your data

### 🎯 Live Demo
- **Pre-loaded real data** — explore the tool immediately with a built-in example dataset
- **One-click switch** — seamlessly toggle between the demo and your own uploads

---

## 🖥️ How It Works

<!-- Demo GIF placeholder — replace with your own screen recording -->
![Demo Walkthrough](docs/demo.gif)

1. **Upload** — Drag & drop one or more blood work PDF reports
2. **Extract** — PDF.js parses text locally in your browser
3. **Standardize** — AI normalizes marker names across labs (with regex fallback)
4. **Analyze** — Trends are calculated, out-of-range markers flagged
5. **Explore** — View sparklines, read AI-powered insights per marker
6. **Export** — Download a full PDF summary to share with your doctor

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Build** | Vite 5 | Dev server & bundling |
| **Styling** | Tailwind CSS + shadcn/ui | Design system & components |
| **Charts** | Recharts | Sparkline trend visualization |
| **PDF Read** | PDF.js (pdfjs-dist) | In-browser PDF text extraction |
| **PDF Write** | jsPDF + jspdf-autotable | PDF report generation |
| **AI Backend** | Supabase Edge Functions | Serverless AI processing |
| **AI Model** | Perplexity AI (sonar-pro) | Lab standardization & health insights |
| **Routing** | React Router v7 | Client-side navigation |
| **State** | React Query + Context | Data fetching & shared state |

---

<details>
<summary><strong>📦 Installation</strong></summary>

### Prerequisites
- Node.js 18+ and npm (or [Bun](https://bun.sh))

### Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

The project uses a `.env` file (auto-configured via Lovable Cloud):

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Backend API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key |

### Backend Functions

Two edge functions power the AI features:

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `standardize-labs` | `/functions/v1/standardize-labs` | Normalizes raw PDF text into structured lab markers |
| `marker-insights` | `/functions/v1/marker-insights` | Generates plain-English health insights per marker |

</details>

<details>
<summary><strong>📁 Project Structure</strong></summary>

```
src/
├── components/
│   ├── dashboard/          # Analytics banner, stats bar, marker sections, export
│   ├── markers/            # MarkerCard, MarkerInsightsPanel
│   ├── upload/             # DropZone, ProcessingModal, ReportList
│   └── ui/                 # shadcn/ui components
├── contexts/
│   └── InsightsContext.tsx  # Shared insights state
├── hooks/
│   ├── useLabData.ts       # Core data management (upload, parse, store)
│   └── useMarkerInsights.ts # AI insights fetching
├── lib/
│   ├── exportPdf.ts        # PDF report generation
│   ├── parseLabs.ts        # Regex-based lab marker parser
│   ├── pdfExtract.ts       # PDF.js text extraction + metadata
│   ├── sampleData.ts       # Built-in demo dataset
│   ├── trends.ts           # Trend calculation & categorization
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
├── pages/
│   └── Index.tsx           # Main application page
└── integrations/
    └── supabase/           # Auto-generated client & types

supabase/
└── functions/
    ├── standardize-labs/   # AI lab standardization edge function
    └── marker-insights/    # AI health insights edge function
```

</details>

---

## 🔒 Privacy & Security

> **Your data stays on your device.**

- ✅ PDF parsing and text extraction happen **entirely in your browser** via PDF.js
- ✅ No files are uploaded to any server for parsing
- ✅ Extracted marker data is stored only in **browser session storage**
- ✅ AI features send only structured marker data (not raw PDFs) to backend functions
- ✅ Clear all data anytime with one click
- ✅ No accounts, no sign-ups, no tracking

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Dhruv Sondhi](https://www.linkedin.com/in/sondhidhruv/)**

[Live Demo](https://health-trend.lovable.app) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>
