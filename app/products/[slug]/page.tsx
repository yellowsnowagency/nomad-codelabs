import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, getProduct } from "@/app/lib/products";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";
import Reveal from "@/app/components/reveal";
import StatusPill from "@/app/components/status-pill";
import BetaForm from "@/app/components/beta-form";
import ProductGallery from "@/app/components/product-gallery";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Not found" };
  const url = `${SITE_URL}/products/${p.slug}`;
  return {
    title: `${p.name} — ${p.tagline}`,
    description: p.summary,
    keywords: [p.name, p.category, p.codename, SITE_NAME, "Nomad Code Labs"],
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title: `${p.name} — ${p.tagline}`,
      description: p.summary,
      type: "website",
      url,
      siteName: SITE_NAME,
      images: p.shots?.[0]
        ? [{ url: p.shots[0].src, alt: p.shots[0].caption }]
        : [{ url: "/og.png", alt: `${SITE_NAME} — ${p.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name} — ${p.tagline}`,
      description: p.summary,
      images: p.shots?.[0] ? [p.shots[0].src] : ["/og.png"],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const idx = PRODUCTS.findIndex((p) => p.slug === slug);
  const next = PRODUCTS[(idx + 1) % PRODUCTS.length];
  const invite = product.status === "INVITE ONLY";

  return (
    <>
      {/* breadcrumb */}
      <div className="shell pt-10">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.16em] uppercase text-[var(--ink-faint)]">
          <Link href="/" className="ul-link">
            Index
          </Link>
          <span>/</span>
          <Link href="/#manifest" className="ul-link">
            Software
          </Link>
          <span>/</span>
          <span className="text-[var(--ink-dim)]">{product.name}</span>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section className="shell pt-12 pb-20 md:pt-16 md:pb-28">
        <Reveal>
          <div className="flex items-center gap-5 mb-8">
            <span className="display text-[clamp(2.5rem,9vw,7rem)] text-[var(--ink-faint)] leading-none">
              {product.index}
            </span>
            <div className="flex flex-col gap-3">
              <StatusPill status={product.status} />
              <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--ink-dim)]">
                {product.category}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="display text-[clamp(2.6rem,10vw,7.5rem)] leading-[0.9]">
            {product.name}
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-8 max-w-3xl text-[clamp(1.1rem,2.6vw,1.7rem)] leading-snug text-[var(--ink)]">
            {product.tagline}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="#register" className="btn btn-solid">
              {product.beta
                ? `Join the ${product.name} beta →`
                : invite
                  ? "Request an invite →"
                  : "Get notified at launch →"}
            </Link>
            <Link href="/#manifest" className="btn">
              ← All software
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ============ SPEC STRIP ============ */}
      <div className="border-y hairline">
        <div className="shell grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: "var(--line)" }}>
          <div className="py-7 sm:pr-8">
            <p className="eyebrow mb-3">Status</p>
            <StatusPill status={product.status} />
          </div>
          <div className="py-7 sm:px-8">
            <p className="eyebrow mb-3">Platforms</p>
            <p className="text-[14px] text-[var(--ink-dim)] leading-relaxed">
              {product.platforms.join(" · ")}
            </p>
          </div>
          <div className="py-7 sm:pl-8">
            <p className="eyebrow mb-3">Built with</p>
            <p className="text-[14px] text-[var(--ink-dim)] leading-relaxed">
              {(product.stack ?? ["—"]).join(" · ")}
            </p>
          </div>
        </div>
      </div>

      {/* ============ PREVIEW / SCREENSHOTS ============ */}
      {product.shots && product.shots.length > 0 && (
        <section className="shell pt-20 md:pt-28">
          <Reveal>
            <div className="flex items-end justify-between gap-4 mb-8">
              <p className="eyebrow">Preview — from the product</p>
              <p className="hidden sm:block text-[11px] tracking-[0.14em] uppercase text-[var(--ink-faint)]">
                Captured from the running product
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ProductGallery shots={product.shots} />
          </Reveal>
        </section>
      )}

      {/* ============ OVERVIEW + FEATURES ============ */}
      <section className="shell py-20 md:py-28 grid gap-16 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <div>
            <p className="eyebrow mb-6">Overview</p>
            <div className="space-y-6 max-w-xl">
              {product.description.map((para, i) => (
                <p
                  key={i}
                  className="text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-[var(--ink-dim)]"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div>
            <p className="eyebrow mb-6">Capabilities</p>
            <div className="border-t hairline">
              {product.features.map((f, i) => (
                <div
                  key={f.label}
                  className="group flex gap-6 py-6 border-b hairline hover:bg-[var(--bg-raised)] transition-colors px-2 -mx-2"
                >
                  <span className="text-[12px] tabular-nums text-[var(--accent)] pt-1 w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[16px] text-[var(--ink)] group-hover:translate-x-1 transition-transform duration-500">
                      {f.label}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-dim)]">
                      {f.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ REGISTER ============ */}
      <section id="register" className="border-t hairline">
        <div className="shell py-20 md:py-28 grid gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
          <Reveal>
            <div>
              <p className="eyebrow mb-4">Access</p>
              <h2 className="display text-[clamp(1.8rem,5vw,3.2rem)] leading-[0.95]">
                {product.beta ? (
                  <>
                    Beta is <span className="text-[var(--accent)]">open</span>.
                    <br />
                    Take a seat.
                  </>
                ) : invite ? (
                  <>
                    By <span style={{ color: "var(--accent-2)" }}>invitation</span>
                    <br />
                    only.
                  </>
                ) : (
                  <>
                    Not shipping
                    <br />
                    yet — but soon.
                  </>
                )}
              </h2>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-[var(--ink-dim)]">
                {product.beta
                  ? `${product.name} is accepting beta users now. Register and we'll send your access when a slot opens.`
                  : invite
                    ? `${product.name} is offered to a small group of members by private invitation. Leave your email to request access and we'll be in touch.`
                    : `${product.name} is in active development. Leave your email and you'll be first to know when the beta opens.`}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <BetaForm
              defaultProduct={product.slug}
              title={
                product.beta
                  ? `Join ${product.name}`
                  : invite
                    ? `Request ${product.name} access`
                    : `Get notified — ${product.name}`
              }
              subtitle={
                product.beta
                  ? "We'll email you when your beta slot opens."
                  : invite
                    ? "Request an invitation and we'll be in touch."
                    : "Be first to know when the beta opens."
              }
            />
          </Reveal>
        </div>
      </section>

      {/* ============ NEXT ============ */}
      <section className="shell py-16">
        <Link
          href={`/products/${next.slug}`}
          className="group flex items-center justify-between border hairline px-6 py-8 hover:border-[var(--accent)] transition-colors"
        >
          <span className="flex flex-col gap-1">
            <span className="eyebrow">Next →</span>
            <span className="text-[clamp(1.3rem,3vw,2rem)] text-[var(--ink)] group-hover:translate-x-2 transition-transform duration-500">
              {next.name}
            </span>
          </span>
          <span className="text-[24px] text-[var(--ink-faint)] group-hover:text-[var(--accent)] transition-colors">
            →
          </span>
        </Link>
      </section>
    </>
  );
}
