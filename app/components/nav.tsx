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
      <div className="shell flex items-center justify-between h-[72px]">
        <Link href="/" className="wordmark text-[15px]">
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
          className="md:hidden text-[14px] text-[var(--ink)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
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
