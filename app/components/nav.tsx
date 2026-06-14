"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#manifest", label: "Software" },
  { href: "/#approach", label: "Studio" },
  { href: "/beta", label: "Beta" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-colors duration-500"
      style={{
        background: scrolled ? "rgba(12,10,9,0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(1.2)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="shell flex items-center justify-between h-[64px] md:h-[72px]">
        <Link href="/" className="wordmark text-[13px] md:text-[15px] tracking-[0.08em] md:tracking-normal">
          NOMAD<span className="text-[var(--accent)]"> // </span>CODELABS
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-[14px] text-[var(--ink-dim)]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="ul-link hover:text-[var(--ink)] transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/beta" className="btn btn-solid">
            Join the beta
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden relative h-10 w-10 text-[var(--ink)]"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span
            className={`absolute left-1/2 h-[1.5px] w-5 -translate-x-1/2 bg-current transition-all duration-300 ease-out ${
              open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[13px]"
            }`}
          />
          <span
            className={`absolute left-1/2 top-1/2 h-[1.5px] w-5 -translate-x-1/2 -translate-y-1/2 bg-current transition-all duration-300 ${
              open ? "opacity-0 scale-x-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-1/2 h-[1.5px] w-5 -translate-x-1/2 bg-current transition-all duration-300 ease-out ${
              open ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-[23px]"
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="md:hidden shell pb-7 flex flex-col gap-5 text-[16px] border-t hairline pt-6">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[var(--ink-dim)]"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/beta" onClick={() => setOpen(false)} className="btn btn-solid w-fit">
            Join the beta
          </Link>
        </div>
      )}
    </header>
  );
}
