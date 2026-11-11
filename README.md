# MotionForge AI ⚡

> Professional AI-Powered Motion Graphics Video Production Studio built with **Remotion**, **React**, **Vite**, **Tailwind CSS**, and **Node.js/Express**.

---

## 🌟 Product Overview

**MotionForge AI** is a prompt-to-motion video production platform. Unlike fixed video templates with static text replacements, MotionForge AI features a **genuinely dynamic motion graphics engine** where every scene, kinetic typography layer, animated SVG shape, timing curve, and transition is procedurally computed and data-driven.

---

## 🛠️ Technology Stack

- **Frontend UI**: React 18, Vite, Tailwind CSS, Lucide React
- **Motion Graphics Engine**: Remotion 4 (`@remotion/player`, `@remotion/shapes`, `spring`, `interpolate`)
- **Backend API**: Node.js, Express, CORS, Multer
- **Media Pipeline**: Remotion Bundler (`@remotion/bundler`), Remotion Renderer (`@remotion/renderer`), Headless Chromium, FFmpeg H.264 Encoder (`@ffmpeg-installer/ffmpeg`)
- **Validation**: Zod schema validation
- **AI Architecture**: Provider-independent adapter supporting Google Gemini API and a zero-dependency local heuristic engine

---

## 🚀 Main Application Modules

1. **Dashboard**: Production overview, quick start templates (AI Product Launch, Viral Social Reel, SaaS Benchmark), and project jump links.
2. **New Video Project**: Interactive wizard configuring video titles, prompt briefs, aspect ratios (16:9, 9:16, 1:1), durations (15s–60s), framerates (24, 30, 60 FPS), and color science themes.
3. **AI Script Generator**: Tone, audience, and pacing controls translating prompts into structured attention hooks, narrative beats, and scene voiceovers.
4. **Storyboard Editor**: Scene-by-scene card editor with duration inputs, archetype badges, transition selectors, reordering controls, and one-click scene regeneration.
5. **Voice & Audio Studio**: Voiceover persona controls with in-browser speech testing, background synth score selection, custom audio upload, and scene-by-scene script synchronization.
6. **Motion Graphics Editor**: Fine-grained property inspector for headlines, kinetic typography, metric counters, feature cards, HUD layouts, and procedural particle/grid layers.
7. **Video Preview Studio**: Interactive embedded Remotion Player with scrub bar, aspect ratio toggling, frame counter, and real-time playback.
8. **Render & Export Studio**: Real server-side Remotion video rendering pipeline generating bona fide H.264 MP4 videos with live progress tracking and direct download.
9. **Project Library**: Local JSON project storage manager supporting search, duplication, JSON export, and JSON import.
10. **Settings**: AI provider switcher (Built-in Local vs. Google Gemini API), API key manager, model selection, and system diagnostics.

---

## 🏃 Running the Application

### Start Development Environment (Frontend + Backend)
```bash
# Start both Backend (Port 5000) and Frontend (Port 3000) concurrently:
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend Express Server
npm run server

# Terminal 2: Frontend Vite Client
npm run client
```

Open your browser at:
`http://localhost:3000`

---

## 📁 Project Structure

```
motionforge-ai/
├── server/
│   ├── index.js              # Express API server entry point
│   ├── routes/
│   │   ├── projects.js       # CRUD endpoints for project JSONs
│   │   ├── ai.js             # Script and storyboard generation
│   │   ├── voice.js          # Speech & music audio management
│   │   └── render.js         # Remotion render pipeline & downloads
│   ├── services/
│   │   ├── ai/               # AI Provider Adapters (Gemini, LocalHeuristic)
│   │   ├── voice/            # Procedural audio generator & TTS
│   │   ├── remotion/         # Bundler & RenderMedia orchestrator
│   │   └── projectStorage.js # Local JSON persistence engine
│   └── data/
│       ├── projects/         # Saved project JSON files
│       ├── audio/            # Built-in & uploaded audio files
│       └── renders/          # Rendered H.264 MP4 video outputs
├── src/
│   ├── App.jsx               # Main studio shell & router
│   ├── index.css             # Tailwind v4 dark studio design system
│   ├── components/           # Header, Sidebar, layout controls
│   ├── modules/              # The 10 studio modules
│   ├── remotion/             # Motion graphics compositions & scenes
│   │   ├── MotionReel.jsx    # Master data-driven timeline composition
│   │   ├── scenes/           # Dynamic scene archetypes
│   │   ├── components/       # Animated SVG shapes, grids, particles
│   │   └── transitions/      # Frame-accurate transition effects
│   ├── schemas/              # Zod project & scene schemas
│   ├── services/             # Client HTTP API client
│   └── store/                # React ProjectContext state manager
```

