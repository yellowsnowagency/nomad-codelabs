"use client";

import { useId, useState } from "react";
import { BETA_PRODUCTS, getProduct } from "@/app/lib/products";

type State = "idle" | "loading" | "ok" | "error";

type BetaFormProps = {
  defaultProduct?: string;
  title?: string;
  subtitle?: string;
  className?: string;
};

function productLabel(status: string) {
  if (status === "BETA OPEN") return "Beta open";
  if (status === "INVITE ONLY") return "Invite only";
  if (status === "IN DEVELOPMENT") return "In development";
  return status.toLowerCase();
}

export default function BetaForm({
  defaultProduct,
  title = "Request beta access",
  subtitle = "Leave your email. We’ll reach out when a slot opens.",
  className = "",
}: BetaFormProps) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const emailId = useId();
  const productId = useId();

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
      <div className={`beta-form-shell beta-form-success ${className}`.trim()}>
        <span className="beta-form-success-dot" aria-hidden />
        <p className="eyebrow mb-3">You&apos;re in</p>
        <p className="text-[17px] leading-relaxed text-[var(--ink)]">{message}</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-7 ul-link text-[14px] text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors"
        >
          Register another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`beta-form-shell ${className}`.trim()}
      noValidate
    >
      <div className="beta-form-header">
        <p className="eyebrow mb-2">Beta access</p>
        <h3 className="display text-[clamp(1.35rem,2.4vw,1.75rem)] text-[var(--ink)] leading-tight">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink-dim)]">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="beta-form-fields">
        <div className="form-field">
          <label className="form-label" htmlFor={emailId}>
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@anywhere.earth"
            className="form-control"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor={productId}>
            Product
          </label>
          <div className="form-select-wrap">
            <select
              id={productId}
              name="product"
              defaultValue={defaultProduct ?? BETA_PRODUCTS[0]?.slug}
              className="form-control form-select"
            >
              {options.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} — {productLabel(p.status)}
                </option>
              ))}
              <option value="all">Everything — keep me posted</option>
            </select>
          </div>
        </div>
      </div>

      {state === "error" ? (
        <p className="form-error" role="alert">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn btn-solid w-full justify-center disabled:opacity-60"
      >
        {state === "loading" ? "Sending…" : "Request access"}
      </button>

      <p className="form-footnote">
        No spam. One email when your beta slot opens. Unsubscribe anytime.
      </p>
    </form>
  );
}
