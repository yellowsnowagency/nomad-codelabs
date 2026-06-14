import Link from "next/link";
import { PRODUCTS } from "@/app/lib/products";

export default function Footer() {
  const year = 2026;
  return (
    <footer id="contact" className="relative z-2 border-t hairline mt-20 md:mt-32">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="wordmark text-[18px]">
              NOMAD<span className="text-[var(--accent)]"> // </span>CODELABS
            </Link>
            <p className="mt-5 md:mt-6 max-w-sm display text-[clamp(1.2rem,4.5vw,1.9rem)] leading-[1.15] text-[var(--ink)]">
              Software, beautifully made for a world without borders.
            </p>
            <p className="mt-7 eyebrow eyebrow-dim">
              Independent · Worldwide · Nomad-based
            </p>
          </div>

          <div>
            <p className="eyebrow mb-6">Software</p>
            <ul className="space-y-3 text-[14px]">
              {PRODUCTS.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="ul-link text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-6">Studio</p>
            <ul className="space-y-3 text-[14px]">
              <li><Link href="/#manifest" className="ul-link text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">All software</Link></li>
              <li><Link href="/beta" className="ul-link text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">Beta program</Link></li>
              <li><Link href="/#approach" className="ul-link text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">Our approach</Link></li>
              <li>
                <a href="mailto:contact@nmdcd.com" className="ul-link text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">
                  contact@nmdcd.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="shell py-7 border-t hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[var(--ink-faint)]">
        <span>
          © {year} NOMAD <span className="text-[var(--accent)]">//</span> CODELABS LLC
          <span className="mx-2">·</span>Delaware File No. 10651993
          <span className="mx-2">·</span>
          <a
            href="mailto:contact@nmdcd.com"
            className="ul-link hover:text-[var(--ink)] transition-colors"
          >
            contact@nmdcd.com
          </a>
        </span>
        <span className="eyebrow eyebrow-dim">Made everywhere, for everyone</span>
      </div>
    </footer>
  );
}
