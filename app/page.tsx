import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, BETA_PRODUCTS } from "./lib/products";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: SITE_URL },
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
};
import WorldClock from "./components/world-clock";
import Reveal from "./components/reveal";
import StatusPill from "./components/status-pill";
import BetaForm from "./components/beta-form";
import RowArrow from "./components/row-arrow";

const APPROACH = [
  {
    n: "01",
    title: "Borderless by design",
    body: "No headquarters. No single timezone. No national bias. We work from wherever the best thinking happens — the work is the studio.",
  },
  {
    n: "02",
    title: "Made, not assembled",
    body: "Every product is built with intent and obsessive detail. From encryption to a single animation curve — nothing here is off-the-shelf.",
  },
  {
    n: "03",
    title: "Loud, but calm",
    body: "Bold on the outside, quiet where it counts. Keyboard-first, offline-aware software you reach for instead of fight with.",
  },
  {
    n: "04",
    title: "One connected world",
    body: "Mail, tasks, invoices, media, markets — distinct products that speak the same language, so your work is never trapped in a silo.",
  },
];

const MARQUEE = [
  "AUDIOCRYPT",
  "FEEPER",
  "FASTING CYCLE",
  "BETTER TV",
  "MINTO",
  "RERISTA",
  "JOE THE TRADER",
  "CLOUDCUT",
];

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="shell pt-12 pb-14 md:pt-16 md:pb-24">
        <Reveal>
          <div className="flex items-center justify-between flex-wrap gap-3 kicker text-[var(--ink-dim)] mb-6 md:mb-14">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-[8px] h-[8px] rounded-full bg-[var(--accent)]"
                style={{ boxShadow: "0 0 14px var(--accent)" }}
              />
              Independent software house
            </span>
            <span className="hidden sm:block">Worldwide · Nomad-based · Est. everywhere</span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="wordmark hero-wordmark whitespace-nowrap text-[var(--ink-dim)] mb-4 md:mb-6">
            NOMAD <span className="text-[var(--accent)] font-normal">//</span> CODELABS
          </h1>
        </Reveal>

        <Reveal delay={130}>
          <h2 className="display hero-tagline text-[var(--ink)]">
            <span className="md:hidden">
              <span className="block">We make</span>
              <span className="block">software,</span>
              <span className="block">
                <span className="text-[var(--accent)]">beautifully</span>.
              </span>
              <span className="block">For a world</span>
              <span className="block">without borders.</span>
            </span>
            <span className="hidden md:block">
              <span className="block whitespace-nowrap">
                We make software,{" "}
                <span className="text-[var(--accent)]">beautifully</span>.
              </span>
              <span className="block whitespace-nowrap">
                For a world without borders.
              </span>
            </span>
          </h2>
        </Reveal>

        <Reveal delay={210}>
          <p className="mt-6 md:mt-8 max-w-xl text-[15px] md:text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed text-[var(--ink-dim)]">
            A worldwide team of makers building modern, meticulously crafted
            software — encrypted, fast, and unapologetically bold. New,
            independent, and entirely our own.
          </p>
        </Reveal>

        <Reveal delay={230}>
          <div className="mt-7 md:mt-10">
            <Link href="#manifest" className="btn btn-solid btn-sm w-fit">
              See our software ↓
            </Link>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 md:mt-14 pt-6 md:pt-7 border-t hairline flex flex-col gap-5 md:gap-6 md:flex-row md:items-center md:justify-between">
            <WorldClock />
            <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-12">
              {[
                [`${PRODUCTS.length}`, "products", "var(--ink)"],
                [`${BETA_PRODUCTS.length}`, "in beta", "var(--accent)"],
                ["∞", "timezones", "var(--ink)"],
              ].map(([n, label, color]) => (
                <span key={label} className="flex items-baseline gap-2">
                  <span className="display text-[clamp(1.8rem,3vw,2.6rem)]" style={{ color }}>
                    {n}
                  </span>
                  <span className="text-[13px] text-[var(--ink-dim)]">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ TICKER ============ */}
      <div className="relative z-2 border-y hairline py-3.5 overflow-hidden">
        <div
          className="marquee-track text-[clamp(0.72rem,1vw,0.85rem)] text-[var(--ink-dim)]"
          style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 300, letterSpacing: "0.2em" }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center">
              {MARQUEE.map((t) => (
                <span key={t} className="flex items-center">
                  <span className="px-5">{t}</span>
                  <span className="text-[var(--accent)]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ============ CATALOGUE ============ */}
      <section id="manifest" className="shell py-14 md:py-32">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16">
            <div>
              <span className="wordmark section-wordmark block text-[var(--ink-dim)] mb-3 md:mb-5 whitespace-nowrap">
                NOMAD <span className="text-[var(--accent)] font-normal">//</span> CODELABS
              </span>
              <h2 className="display section-heading whitespace-nowrap">
                Our software
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-[var(--ink-dim)] md:mb-3">
              <span className="eyebrow block mb-3">The catalogue</span>
              A growing house of products — some in your hands today, others in
              active build. Every one made to the same standard.
            </p>
          </div>
        </Reveal>

        <div className="border-t hairline">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 22}>
              <Link
                href={`/products/${p.slug}`}
                className="product-row group grid grid-cols-[auto_1fr_auto] md:grid-cols-[90px_1fr_220px_56px] gap-3 md:gap-8 items-center py-4 md:py-7 border-b hairline"
              >
                <span className="display text-[clamp(1rem,1.6vw,1.6rem)] text-[var(--ink-faint)] group-hover:text-[var(--accent)] transition-colors">
                  {p.index}
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="display product-name text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors duration-300 truncate">
                    {p.name}
                  </span>
                  <span className="text-[12px] md:text-[13px] text-[var(--ink-dim)] mt-1 md:hidden">
                    {p.tagline}
                  </span>
                  <span className="text-[13px] text-[var(--ink-dim)] mt-1 hidden md:block">
                    {p.tagline}
                  </span>
                </span>
                <span className="hidden md:flex flex-col items-start gap-2">
                  <StatusPill status={p.status} />
                  <span className="text-[12px] text-[var(--ink-faint)]">{p.category}</span>
                </span>
                <RowArrow className="justify-self-end" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ STUDIO ============ */}
      <section id="approach" className="border-y hairline bg-[var(--bg-2)]">
        <div className="shell py-14 md:py-32">
          <Reveal>
            <span className="eyebrow block mb-5 md:mb-6">The studio</span>
            <h2 className="display section-heading max-w-[14ch] mb-10 md:mb-20">
              We build the way the modern world{" "}
              <span className="text-[var(--accent)]">works</span>.
            </h2>
          </Reveal>
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
            {APPROACH.map((a, i) => (
              <Reveal key={a.n} delay={i * 70}>
                <div className="flex gap-6 border-t hairline pt-7">
                  <span className="display text-[clamp(1.4rem,2vw,2rem)] text-[var(--accent)]">
                    {a.n}
                  </span>
                  <div>
                    <h3 className="display text-[clamp(1.5rem,3vw,2.3rem)] text-[var(--ink)]">
                      {a.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-dim)] max-w-md">
                      {a.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BETA ============ */}
      <section className="shell py-14 md:py-32">
        <div className="grid gap-10 md:gap-14 lg:grid-cols-[1.15fr_1fr] items-start">
          <Reveal>
            <div>
              <span className="eyebrow block mb-5 md:mb-6">Early access</span>
              <h2 className="display section-heading leading-[0.9]">
                THE BETA
                <br />
                IS <span className="text-[var(--accent)]">OPEN</span>
              </h2>
              <p className="mt-9 max-w-md text-[16px] leading-relaxed text-[var(--ink-dim)]">
                Audiocrypt, Fasting Cycle, and Feeper are welcoming early users
                right now. Choose a product, leave your email, and you&apos;ll be
                first through the door.
              </p>

              <div className="mt-10 flex flex-col gap-3">
                {BETA_PRODUCTS.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="group flex items-center justify-between card px-6 py-5 hover:border-[var(--accent)] transition-colors"
                  >
                    <span className="flex items-center gap-4">
                      <span className="display text-[15px] text-[var(--ink-faint)]">
                        {p.index}
                      </span>
                      <span className="display text-[clamp(1.3rem,2.4vw,1.8rem)] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                        {p.name}
                      </span>
                    </span>
                    <StatusPill status={p.status} />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={130}>
            <BetaForm
              title="Join the beta"
              subtitle="Audiocrypt, Fasting Cycle, or Feeper — or follow the whole catalogue."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
