export type Status =
  | "BETA OPEN"
  | "IN DEVELOPMENT"
  | "ALPHA"
  | "RESEARCH"
  | "INVITE ONLY";

export type Platform =
  | "iOS"
  | "Android"
  | "macOS"
  | "Windows"
  | "Linux"
  | "tvOS"
  | "Web"
  | "API";

export interface Shot {
  src: string;
  caption: string;
  kind?: "screen" | "device"; // "device" = phone screenshot, framed differently
}

export interface Product {
  slug: string;
  index: string; // "00".."10"
  name: string;
  codename: string; // short machine-name shown in the manifest
  category: string;
  status: Status;
  tagline: string;
  summary: string;
  description: string[]; // paragraphs
  features: { label: string; detail: string }[];
  platforms: Platform[];
  stack?: string[];
  beta: boolean;
  shots?: Shot[]; // live captures of the actual product
}

export const PRODUCTS: Product[] = [
  {
    slug: "audiocrypt",
    index: "00",
    name: "Audiocrypt",
    codename: "audiocrypt",
    category: "Encrypted distribution",
    status: "BETA OPEN",
    tagline: "Encrypt once. Sell everywhere. Steal nothing.",
    summary:
      "A secure digital rights and licensing management server with easy-to-use interfaces — built for healthcare audio files, digital creators, course creators, music composers, audio professionals, and independent studios.",
    description: [
      "AudioCrypt is a secure digital rights and licensing management server with easy-to-use interfaces, built for healthcare audio files, digital creators, course creators, music composers, audio professionals, and independent studios. Files are encrypted once with military-grade AES-256-GCM and are never stored unencrypted — every asset carries a unique key.",
      "The core architecture is license-gated offline playback: purchased files download to the customer's player and stay playable offline for as long as the license is valid. Distribute high-value audio everywhere without making the source easy to copy, steal, or use outside a license.",
    ],
    features: [
      { label: "AES-256-GCM", detail: "Per-asset encryption keys. Source files are never stored in the clear." },
      { label: "Offline-first", detail: "License-gated local playback that survives without a connection." },
      { label: "Sell everywhere", detail: "One encryption pass, distributed across any storefront or channel." },
      { label: "Console + Player", detail: "Superadmin console, publisher dashboard, and a dedicated secure player." },
    ],
    platforms: ["Web", "API", "macOS", "Windows", "iOS", "Android"],
    stack: ["AES-256-GCM", "Licensing", "Offline DRM", "Multi-tenant"],
    beta: true,
    shots: [
      {
        src: "/screens/audiocrypt-console.png",
        caption: "Publishing console — the command layer for licensing, catalog, and analytics.",
      },
      {
        src: "/screens/audiocrypt-player.png",
        caption: "Standalone secure player — AES-256 license-gated offline playback.",
      },
    ],
  },
  {
    slug: "fasting-cycle",
    index: "01",
    name: "Fasting Cycle",
    codename: "fasting-cycle",
    category: "Health & rhythm",
    status: "BETA OPEN",
    tagline: "One circle. Always on the phase you're in.",
    summary:
      "A beautiful intermittent-fasting companion for iPhone and Android, built around a single zooming circle that focuses on your current phase.",
    description: [
      "Fasting Cycle is a calm, precise fasting companion built around one idea: a single zooming circle that always focuses on the phase you're in — fasting, eating, or a full day's rhythm. No clutter, no guilt, just where you are right now.",
      "Track your window alongside weight, water, and steps, with gentle reminders for what's next. Designed for people who live across timezones, so your cycle follows you, not a clock in another country. Beta is open on iPhone and Android.",
    ],
    features: [
      { label: "The zooming circle", detail: "A live phase ring that zooms to whatever you're doing right now." },
      { label: "Phase-aware", detail: "Fasting, eating, and full-day views that read at a glance." },
      { label: "More than a timer", detail: "Weight, water, and step trackers in the same calm surface." },
      { label: "Reminders that help", detail: "Quiet nudges for the next thing — not a stream of nags." },
    ],
    platforms: ["iOS", "Android"],
    stack: ["SwiftUI", "FastingCore (Swift)", "Native iOS"],
    beta: true,
    shots: [
      { src: "/screens/fasting-eating.png", caption: "Eating window — the ring zooms to the active phase.", kind: "device" },
      { src: "/screens/fasting-fasting.png", caption: "16 hours fasting — at-a-glance phase state.", kind: "device" },
      { src: "/screens/fasting-fullday.png", caption: "A full day's rhythm with water, weight, and steps.", kind: "device" },
    ],
  },
  {
    slug: "feeper",
    index: "02",
    name: "Feeper",
    codename: "feeper",
    category: "Invoicing",
    status: "BETA OPEN",
    tagline: "Gorgeous invoices for freelancers and nomads.",
    summary:
      "The calmest way to send estimates and invoices — built for freelancers, small teams, and people who'd rather do the work.",
    description: [
      "Feeper is a multi-tenant invoicing SaaS for freelancers who'd rather be doing the work than fighting their billing tool. Beautiful, keyboard-first, and fast.",
      "Tax regimes are handled from day one — EU VAT with reverse-charge, US sales tax, UAE VAT, Australian GST — so a nomad billing across borders never has to think twice. Estimates convert to invoices in one click, with partial payments, status tracking, and gapless numbering.",
    ],
    features: [
      { label: "Keyboard-first editor", detail: "A line-item editor designed to be driven entirely from the keyboard." },
      { label: "Tax from day one", detail: "EU VAT (reverse-charge), US sales tax, UAE VAT, AU GST." },
      { label: "Estimates → Invoices", detail: "One-click conversion, partial payments, gapless numbering." },
      { label: "Share links + PDF", detail: "Public client links with no login, plus Modern & Classic PDF templates." },
    ],
    platforms: ["Web", "API"],
    stack: ["Next.js 15", "PostgreSQL", "Drizzle", "Stripe", "Resend"],
    beta: true,
    shots: [
      {
        src: "/screens/feeper.png",
        caption: "Gorgeous invoices, zero friction — estimates, invoices, and shareable PDFs.",
      },
    ],
  },
  {
    slug: "better-tv",
    index: "03",
    name: "Better TV",
    codename: "better-tv",
    category: "Media client",
    status: "IN DEVELOPMENT",
    tagline: "Every screen. One library. Perfectly in sync.",
    summary:
      "A syncable multi-platform IPTV client for Xtream Codes, M3U, Jellyfin, and Emby — with cross-device sync and a hybrid recommendation engine.",
    description: [
      "Better TV unifies Xtream Codes, M3U/M3U8, Jellyfin, and Emby behind one clean interface, on every screen you own — iOS, tvOS, macOS, Android phone and TV, Windows, and Linux.",
      "A shared Kotlin Multiplatform core owns the media abstraction, parsers, sync engine, and recommendation client, so your library, history, and recommendations stay identical across every device.",
    ],
    features: [
      { label: "Universal sources", detail: "Xtream Codes, M3U/M3U8, Jellyfin, and Emby in one client." },
      { label: "Cross-device sync", detail: "Library, history, and progress mirrored across every screen." },
      { label: "Hybrid recommendations", detail: "A self-hosted engine with optional TMDb metadata enrichment." },
      { label: "Native everywhere", detail: "SwiftUI, Jetpack Compose, and Compose Multiplatform over a KMP core." },
    ],
    platforms: ["iOS", "tvOS", "macOS", "Android", "Windows", "Linux"],
    stack: ["Kotlin Multiplatform", "SwiftUI", "Compose", "NestJS", "pgvector"],
    beta: false,
  },
  {
    slug: "minto-contact",
    index: "04",
    name: "Minto Contact",
    codename: "minto-contact",
    category: "Minto suite",
    status: "IN DEVELOPMENT",
    tagline: "The address book that actually remembers.",
    summary:
      "A modern contacts layer for the Minto suite — relationships, context, and history in one calm surface.",
    description: [
      "Minto Contact is the people layer of the Minto suite. Contacts gain context — projects, threads, and history — without turning into a CRM you have to feed.",
      "Built to interoperate with Minto Task and Minto Form Creator, so a person, a job, and a request are never three disconnected silos.",
    ],
    features: [
      { label: "Context-rich", detail: "Every contact carries its projects, threads, and history." },
      { label: "Suite-native", detail: "Shares a spine with Minto Task and Form Creator." },
      { label: "Calm by default", detail: "No busywork, no feeding a CRM that resents you." },
      { label: "Yours", detail: "Built around ownership of your own relationship graph." },
    ],
    platforms: ["Web", "iOS", "Android"],
    stack: ["Minto core", "Sync"],
    beta: false,
  },
  {
    slug: "minto-task",
    index: "05",
    name: "Minto Task",
    codename: "minto-float",
    category: "Minto suite",
    status: "IN DEVELOPMENT",
    tagline: "Tasks that float to where the work actually is.",
    summary:
      "A deluxe task manager built on the Minto float model — fluid, fast, and quietly powerful.",
    description: [
      "Minto Task (Minto Float) is a task manager built around motion: work floats to where attention is, instead of rotting at the bottom of a list. Fast capture, fluid organization, deluxe detail.",
      "Part of the Minto suite, it speaks natively with Contact and Form Creator so a task always knows who and what it's about.",
    ],
    features: [
      { label: "Float model", detail: "Work surfaces by relevance, not by the order you typed it." },
      { label: "Fast capture", detail: "Frictionless entry that gets out of your way." },
      { label: "Suite-native", detail: "Linked to Minto Contact and Form Creator." },
      { label: "Deluxe detail", detail: "Rich task surfaces when you want them, silence when you don't." },
    ],
    platforms: ["Web", "iOS", "Android", "macOS"],
    stack: ["Minto core", "Realtime sync"],
    beta: false,
  },
  {
    slug: "minto-form-creator",
    index: "06",
    name: "Minto Form Creator",
    codename: "minto-forms",
    category: "Minto suite",
    status: "IN DEVELOPMENT",
    tagline: "Forms that compose themselves around the question.",
    summary:
      "A form builder for the Minto suite — structured intake that flows straight into Contact and Task.",
    description: [
      "Minto Form Creator turns questions into structured intake. Build forms quickly, share them anywhere, and route responses directly into the Minto suite.",
      "Responses become contacts and tasks automatically, closing the loop between asking and doing.",
    ],
    features: [
      { label: "Compose fast", detail: "A builder that keeps pace with your thinking." },
      { label: "Routed responses", detail: "Submissions flow into Minto Contact and Task." },
      { label: "Share anywhere", detail: "Public links, embeds, and clean response views." },
      { label: "Structured intake", detail: "Typed fields that downstream tools can actually use." },
    ],
    platforms: ["Web"],
    stack: ["Minto core"],
    beta: false,
  },
  {
    slug: "rerista",
    index: "07",
    name: "Rerista",
    codename: "rerista",
    category: "Publishing",
    status: "IN DEVELOPMENT",
    tagline: "The future of product journalism.",
    summary:
      "A magazine for the products that shape our world — in-depth reviews, expert insight, and stories that matter.",
    description: [
      "Rerista is a new way to discover, explore, and understand the products that shape our world. In-depth reviews, expert insights, and the stories behind the things we use every day.",
      "Built for a distributed editorial team that breaks and ships stories across timezones, with typography and pacing that respect long-form reading.",
    ],
    features: [
      { label: "In-depth reviews", detail: "Product journalism with real reporting behind it." },
      { label: "Expert insight", detail: "Stories that go past the spec sheet." },
      { label: "Editorial-grade", detail: "Typography and pacing built for long-form reading." },
      { label: "Distributed newsroom", detail: "An editorial team that works across timezones." },
    ],
    platforms: ["Web"],
    stack: ["Next.js", "Editorial CMS", "CDN media"],
    beta: false,
    shots: [
      {
        src: "/screens/rerista.png",
        caption: "Rerista — the future of product journalism. Launching soon.",
      },
    ],
  },
  {
    slug: "film-scheduler",
    index: "08",
    name: "Film Project Scheduler",
    codename: "film-scheduler",
    category: "Production",
    status: "IN DEVELOPMENT",
    tagline: "Breakdowns and schedules for film and TV, finally calm.",
    summary:
      "Production breakdown and scheduling for film and TV — script to strip-board to shooting schedule.",
    description: [
      "Film Project Scheduler takes a production from script breakdown to strip-board to a working shooting schedule. Built for ADs and producers who live in the realities of a set.",
      "Scenes, cast, locations, and elements stay linked, so a single change ripples through the whole schedule instead of breaking it.",
    ],
    features: [
      { label: "Script breakdown", detail: "Tag scenes, cast, locations, and elements once." },
      { label: "Strip-board", detail: "A scheduling board that maps to how shoots really run." },
      { label: "Linked changes", detail: "Move a scene and the schedule re-flows around it." },
      { label: "Built for set", detail: "Designed with ADs and producers, not against them." },
    ],
    platforms: ["Web", "iOS"],
    stack: ["Scheduling engine"],
    beta: false,
  },
  {
    slug: "joe-the-trader",
    index: "09",
    name: "Joe the Trader",
    codename: "joe-the-trader",
    category: "Autonomous markets",
    status: "INVITE ONLY",
    tagline: "An autonomous AI trading desk that runs itself.",
    summary:
      "A full AI trading desk — a team of specialist agents that research, mirror disclosed trades, manage risk, and execute. Sold by private invitation only.",
    description: [
      "Joe the Trader isn't a copilot — it's an entire desk. A team of specialist AI agents diagnoses the book, surfaces conviction, mirrors disclosed political and insider trades, runs strategy lanes like PEAD and momentum, and executes under hard risk gating. It explains every move in plain language, then does it.",
      "Research agents pull disclosed trades and earnings, a risk officer sets the envelope, an execution agent places the orders, and a portfolio agent keeps the book concentrated instead of drowning in noise. Joe is a working product with a complete agentic operations layer — offered to a small group of members by private invitation.",
    ],
    features: [
      { label: "A team of agents", detail: "Research, risk, execution, and portfolio agents working in parallel, not one model guessing." },
      { label: "Disclosed-trade mirroring", detail: "Tracks and mirrors disclosed political and insider trades within your risk scale." },
      { label: "Strategy lanes", detail: "PEAD, momentum, activist, insider-buying, and capitol-trades lanes, each gated before it fires." },
      { label: "Hard risk gating", detail: "Per-ticker caps and rule exits enforced automatically — discipline the book can't skip." },
    ],
    platforms: ["Web"],
    stack: ["Multi-agent AI", "Live market data", "Risk engine", "Autonomous execution"],
    beta: false,
    shots: [
      { src: "/screens/joe-dashboard.png", caption: "The desk — portfolio, strategy breakdown, open positions, and a live agent feed." },
      { src: "/screens/joe-command-center.png", caption: "Command center — the agent team executing a trim-and-concentrate plan in real time." },
    ],
  },
  {
    slug: "writers-room",
    index: "10",
    name: "Writer's Room",
    codename: "writers-room",
    category: "Writing",
    status: "RESEARCH",
    tagline: "Where stories get built before they get written.",
    summary:
      "A collaborative writing room for screenwriters and authors — outlines, beats, and drafts in one place.",
    description: [
      "Writer's Room is a collaborative space for screenwriters and authors to build stories before they write them — beats, outlines, characters, and drafts living in one connected room.",
      "Designed for distributed writing teams who break story together across continents. In research.",
    ],
    features: [
      { label: "Beat board", detail: "Structure a story before the prose exists." },
      { label: "Connected drafts", detail: "Outline, beats, and pages stay linked." },
      { label: "Collaborative", detail: "A writers' room that works across timezones." },
      { label: "Author + screen", detail: "Built for both novelists and screenwriters." },
    ],
    platforms: ["Web", "macOS"],
    stack: ["Collaboration", "Realtime"],
    beta: false,
  },
  {
    slug: "minto-mail",
    index: "11",
    name: "Minto Mail",
    codename: "minto-mail",
    category: "Minto suite",
    status: "IN DEVELOPMENT",
    tagline: "A Mac mail client that finally feels like one app.",
    summary:
      "A modern, minimalist, keyboard-first Mac mail client — group-based inbox, messenger-style threads, and AI assist throughout.",
    description: [
      "Minto Mail is a keyboard-first Mac mail client for people who live in their inbox. Group-based organization, messenger-style threads, and AI assist woven through composing, triage, and search — in the spirit of Tempo, Newton, Superhuman, and Linear.",
      "Built as a tiny native shell (Tauri 2 + SolidJS) so it opens instantly and stays out of the way. Part of the Minto suite, sharing a spine with Contact, Task, and Form Creator.",
    ],
    features: [
      { label: "Keyboard-first", detail: "Triage and navigate the whole inbox without touching the mouse." },
      { label: "Group-based inbox", detail: "Sort mail by the hats you wear — Softdev, Film Director, and more." },
      { label: "AI assist throughout", detail: "Drafting, summarizing, and triage help built into the flow." },
      { label: "Tiny native shell", detail: "A ~10 MB Tauri app that opens instantly and feels like macOS." },
    ],
    platforms: ["macOS"],
    stack: ["Tauri 2", "SolidJS", "SQLite", "Claude API"],
    beta: false,
  },
  {
    slug: "cloudcut-supersonic",
    index: "12",
    name: "CloudCut SuperSonic",
    codename: "cloudcut-supersonic",
    category: "Infrastructure",
    status: "IN DEVELOPMENT",
    tagline: "Line-rate file transfer. Saturate the pipe.",
    summary:
      "A production-grade large-file transfer tool — parallel multipart uploads to Cloudflare R2 with resume and per-part verification.",
    description: [
      "CloudCut SuperSonic moves huge files at line rate. A Rust transfer engine splits uploads into dozens of parallel parts (32 by default, tunable to 128), verifies each with SHA-256, and resumes automatically from any failure.",
      "A minimal native desktop app (Tauri 2 + React) on macOS and Windows, a headless CLI for automation, and a Cloudflare Worker that orchestrates R2 and can stream downloads while the upload is still in flight.",
    ],
    features: [
      { label: "Massively parallel", detail: "32 parts by default, configurable from 8 to 128, to saturate your link." },
      { label: "Resume anywhere", detail: "Automatic resume from failed transfers — no restarting a 40 GB upload." },
      { label: "Per-part verification", detail: "SHA-256 checksums on every part for end-to-end integrity." },
      { label: "Stream-while-upload", detail: "A Cloudflare Worker streams downloads from R2 before the upload finishes." },
    ],
    platforms: ["macOS", "Windows", "API"],
    stack: ["Rust", "Tauri 2", "React", "Cloudflare R2", "Workers"],
    beta: false,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const BETA_PRODUCTS = PRODUCTS.filter((p) => p.beta);
