

## Plan: Create Visual README.md

### Overview
Generate a comprehensive, visually rich README.md for **HealthTrend** — a privacy-first blood work visualization tool. The README will follow open-source best practices with a hero section, badges, collapsible sections, and structured feature/architecture tables.

### Key Project Facts (from codebase analysis)
- **Product**: Upload blood work PDFs, visualize trends, get AI-powered insights — all privacy-first (PDF parsing happens in-browser)
- **Target audience**: Health-conscious individuals tracking blood work over time
- **Live URL**: https://health-trend.lovable.app
- **Tech**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Recharts + PDF.js + jsPDF + Perplexity AI (via backend functions)
- **Backend functions**: `standardize-labs` (AI-powered PDF parsing) and `marker-insights` (AI health insights per marker)
- **Key features**: PDF upload & extraction, AI lab standardization with regex fallback, trend analysis with out-of-range/worsening detection, sparkline charts, AI insights per marker, PDF export, live demo with real data

### File Change
**`README.md`** — Full rewrite with:

1. **Hero section** with centered title, subtitle, banner placeholder
2. **Shields.io badges** for React, TypeScript, Vite, Tailwind, Perplexity AI, status badge
3. **Live demo link** to published URL
4. **Features section** with categorized bullet list (emoji headers)
5. **How it works** with demo GIF placeholder and step-by-step flow
6. **Tech stack table** covering frontend, AI/backend, PDF layers
7. **Collapsible `<details>` sections** for Installation and Project Structure
8. **Privacy & Security section** emphasizing browser-local processing
9. **Contributing and License sections**
10. **Footer with author credit** (Dhruv Sondhi LinkedIn)

This is a single-file change with no functional code impact.

