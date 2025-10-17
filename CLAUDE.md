# CLAUDE.md

Instructions for Claude Code when working in this repository.

## Project Overview

Personal portfolio site for **Murad Farzulla** - Adversarial Systems Researcher.

**Architecture:** Static HTML/CSS/JS site hosted on GitHub Pages. No server-side processing, no user input, no backend.

**Design System:** Dystopian surveillance aesthetic - blood red accents, brutal typography, glitch effects, cursor-tracking eye.

### Brand Architecture

**Studio Farzulla** (farzulla.com) - THIS SITE:
- Personal creative + technical brand
- Portfolio showcasing projects, poetry, essays, lab infrastructure
- Casual technical voice with 3am lab notes aesthetic

**Farzulla Research** (farzulla.org) - SEPARATE SITE:
- Academic research organization
- Formal research outputs, working papers, preprints
- Principal Investigator framing

## Core Philosophy

**Brand Positioning:** Adversarial Systems Researcher
- Pattern: discover → research → break → overengineer → document at 3am
- Technical work: finance, security, AI (dual-LLM agents, crypto volatility, autonomous pentesting)
- Creative work: poetry, essays on absurdism and surveillance capitalism

**Voice & Tone:** Casual technical precision with self-aware humor. Lab notes from 3am chaos, not polished portfolio.

## Writing Style Rules

**BANNED PHRASES** (never use):
- "exciting," "thrilling," "amazing journey"
- "paradigm," "revolutionary," "game-changing"
- "leverage," "unlock," "empower" (startup context)
- "I'm thrilled to announce," "I'm excited to share"
- "production ready" (say "proof of concept" or "functional prototype")
- Any LinkedIn-speak

**APPROVED PATTERNS:**
- "Results show successful orchestration followed by instantaneous database corruption"
- "Sample size n=1, extremely scientific"
- "Nobody asked for this. Built it anyway."
- "Should have added debug logging first. Didn't. Paid the price."
- "Worth it (probably)"

See existing `blog.html` for reference voice.

## File Structure

**Master Hub Pages:**
- `systems-research.html` - Technical work hub (research, projects, lab, bugs & fixes)
- `expression-synthesis.html` - Creative work hub (philosophy, poetry, visual art, library)

**Detail Pages (linked from hubs):**
- `research.html` - Full academic research (crypto volatility, AI safety, quant finance)
- `projects.html` - Full technical projects (autonomous agents, MCP servers, event studies)
- `lab.html` - Complete lab infrastructure (BlackArch, K3s cluster, pentesting)
- `bugs-fixes.html` - Cross-platform debugging solutions (formerly linux-solutions.html)
- `essays.html`, `poetry.html` - Full philosophy and poetry content
- `library.html` - Complete reading collection

**Other:**
- `index.html` - Homepage (about, writing sections, art gallery, contact)
- `blog.html` - Lab notes (3am experiments documented in real-time)
- `creative.html` - Creative landing (currently less used)

**Assets:**
- `css/dystopia.css` - Single stylesheet (surveillance/brutalist theme)
- `js/dystopia.js` - Core interactions (surveillance eye, glitch effects, audio)
- `js/lazy-load.js` - Image optimization

## Design System

**Colors:**
- Primary: `var(--blood-red)` (#DC143C)
- Background: `var(--void-black)` (#000000)
- Text: `var(--pure-white)` (#FFFFFF)
- Cards: `var(--ash-gray)` (#1a1a1a)
- Borders: `var(--smoke)` (#2a2a2a)

**Typography:**
- Monospace: Courier Prime
- Display: Bebas Neue, Oswald
- Use `clamp()` for responsive sizing

**Key Components:**
- `.section-brutal` - Main content sections
- `.surveillance-nav` - Top navigation bar
- `.glitch` - Glitch text effect
- Card variants: `.hardware-card`, `.research-card`, `.project-card`, `.experiment-card`

## Development

**Local server:**
```bash
python -m http.server 8000
# OR
npx serve .
```

**Performance:** Already optimized
- Throttled scroll handlers (150ms glitch, 50ms parallax)
- Intersection Observer for lazy loading
- AudioContext cleanup after playback
- No particle systems or heavy loops

**Navigation:** All pages share same nav structure. Update all pages when adding new sections.

## Content Guidelines

**About Section:** Should reflect adversarial research pattern (find → break → document → overengineer).

**Project Descriptions:** Technical but human. Acknowledge mistakes. Include actual specs and timings.

**Research Content:** Maintain technical rigor while staying casual. No hype, just results.

**Contact Sections:** Sound like actual human communication, not marketing copy.

## What This Site Is

Running log of experiments across finance, security, and AI. Not a polished portfolio—documentation of what breaks and why. Built for peers who understand the domains, not for evangelizing to general audience.

Personal brand showing technical competence, creative expression, and adversarial thinking applied across disciplines.

---

**Last Updated:** October 2025 (full cleanup of baroque theme remnants)
