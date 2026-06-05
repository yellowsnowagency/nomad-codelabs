"use client";

import { useState } from "react";
import { BETA_PRODUCTS, getProduct } from "@/app/lib/products";

type State = "idle" | "loading" | "ok" | "error";

export default function BetaForm({ defaultProduct }: { defaultProduct?: string }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  // Always make sure the product being viewed is selectable, even if it isn't
  // a public-beta product (e.g. an invite-only product subpage).
  const extra =
    defaultProduct && !BETA_PRODUCTS.some((p) => p.slug === defaultProduct)
      ? getProduct(defaultProduct)
      : undefined;
  const options = extra ? [extra, ...BETA_PRODUCTS] : BETA_PRODUCTS;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const product = String(data.get("product") || "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setState("loading");
    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product }),
      });
      if (!res.ok) throw new Error("request failed");
      setState("ok");
      setMessage("You're on the list. We'll reach out when your slot opens.");
      form.reset();
    } catch {
      setState("error");
      setMessage("Something went wrong. Try again in a moment.");
    }
  }

  if (state === "ok") {
    return (
      <div className="card p-9">
        <p className="eyebrow mb-4">✦ You&apos;re in</p>
        <p className="text-[17px] leading-relaxed text-[var(--ink)]">{message}</p>
        <button
          onClick={() => setState("idle")}
          className="mt-7 ul-link text-[14px] text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors"
        >
          Register another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-7 sm:p-9 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="eyebrow" htmlFor="beta-email">
          Email
        </label>
        <input
          id="beta-email"
          name="email"
          type="email"
          required
          placeholder="you@anywhere.earth"
          className="bg-transparent border-b hairline py-3 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="eyebrow" htmlFor="beta-product">
          Product
        </label>
        <select
          id="beta-product"
          name="product"
          defaultValue={defaultProduct ?? BETA_PRODUCTS[0]?.slug}
          className="bg-transparent border-b hairline py-3 text-[15px] text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-colors appearance-none cursor-pointer"
        >
          {options.map((p) => (
            <option key={p.slug} value={p.slug} className="bg-[var(--bg-raised)]">
              {p.name}
              {p.status === "BETA OPEN"
                ? " — beta open"
                : p.status === "INVITE ONLY"
                  ? " — request invite"
                  : ""}
            </option>
          ))}
          <option value="all" className="bg-[var(--bg-raised)]">
            Everything — keep me posted
          </option>
        </select>
      </div>

      <button type="submit" disabled={state === "loading"} className="btn btn-solid justify-center mt-1 disabled:opacity-60">
        {state === "loading" ? "Registering…" : "Request access →"}
      </button>

      {state === "error" && (
        <p className="text-[12px] text-[var(--danger)]">{message}</p>
      )}
      <p className="text-[11px] leading-relaxed text-[var(--ink-faint)]">
        No spam. One email when your beta slot opens. Unsubscribe anytime.
      </p>
    </form>
  );
}
