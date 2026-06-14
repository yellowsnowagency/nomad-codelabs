"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingGate({ heading }: { heading?: string }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/onboarding/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Access denied");
      }
      router.refresh();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Access denied");
    }
  }

  return (
    <section className="shell pt-24 pb-32 flex justify-center">
      <form onSubmit={submit} className="beta-form-shell w-full max-w-md" noValidate>
        <div className="beta-form-header">
          <p className="eyebrow mb-2">Restricted</p>
          <h1 className="display text-[clamp(1.4rem,2.6vw,1.9rem)] text-[var(--ink)] leading-tight">
            {heading ?? "Enter password"}
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink-dim)]">
            This page is private. Enter the onboarding password to continue.
          </p>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="onb-pw">
            Password
          </label>
          <input
            id="onb-pw"
            type="password"
            autoComplete="off"
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="form-control"
            placeholder="••••••••"
          />
        </div>

        {state === "error" ? (
          <p className="form-error" role="alert">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={state === "loading" || pw.length === 0}
          className="btn btn-solid w-full justify-center disabled:opacity-60"
        >
          {state === "loading" ? "Checking…" : "Unlock"}
        </button>
      </form>
    </section>
  );
}
