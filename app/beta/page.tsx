import type { Metadata } from "next";
import Link from "next/link";
import { BETA_PRODUCTS, PRODUCTS } from "@/app/lib/products";
import Reveal from "@/app/components/reveal";
import StatusPill from "@/app/components/status-pill";
import BetaForm from "@/app/components/beta-form";

export const metadata: Metadata = {
  title: "Beta program — get early access",
  description:
    "Join the Nomad Code Labs beta program. Audiocrypt, Fasting Cycle, and Feeper are accepting beta users now.",
};

export default function BetaPage() {
  const upcoming = PRODUCTS.filter((p) => !p.beta);

  return (
    <>
      <section className="shell pt-16 pb-12 md:pt-24">
        <Reveal>
          <p className="eyebrow mb-6">Beta program</p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="display text-[clamp(2.6rem,11vw,8rem)] leading-[0.88]">
            Get in
            <br />
            <span className="text-[var(--accent)]">early.</span>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-2xl text-[clamp(1rem,2.2vw,1.35rem)] leading-relaxed text-[var(--ink-dim)]">
            Three products are in open beta right now. Register once — pick a
            single product or ask us to keep you posted on everything.
          </p>
        </Reveal>
      </section>

      <section className="shell pb-24 grid gap-12 lg:grid-cols-[1fr_1fr] items-start">
        {/* open now */}
        <Reveal>
          <div>
            <p className="eyebrow mb-6">Open now</p>
            <div className="flex flex-col gap-3">
              {BETA_PRODUCTS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group border hairline p-6 hover:border-[var(--accent)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-3">
                      <span className="text-[12px] tabular-nums text-[var(--ink-faint)]">
                        {p.index}
                      </span>
                      <span className="text-[19px] text-[var(--ink)] group-hover:translate-x-1 transition-transform duration-500">
                        {p.name}
                      </span>
                    </span>
                    <StatusPill status={p.status} />
                  </div>
                  <p className="text-[13px] leading-relaxed text-[var(--ink-dim)]">
                    {p.summary}
                  </p>
                </Link>
              ))}
            </div>

            <p className="eyebrow mt-12 mb-6">Coming soon</p>
            <div className="flex flex-wrap gap-2">
              {upcoming.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="text-[12px] tracking-[0.04em] border hairline px-3 py-2 text-[var(--ink-dim)] hover:border-[var(--accent)] hover:text-[var(--ink)] transition-colors"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        {/* form */}
        <Reveal delay={120}>
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow mb-6">Register</p>
            <BetaForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
