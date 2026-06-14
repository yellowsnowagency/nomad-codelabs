"use client";

import { useState } from "react";

function toB64Url(obj: Record<string, unknown>): string {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const TEXT_FIELDS: { key: string; label: string; placeholder?: string }[] = [
  { key: "company_name", label: "Company name" },
  { key: "legal_form", label: "Legal form", placeholder: "GmbH, UG, LLC …" },
  { key: "register_no", label: "Commercial register no." },
  { key: "vat_id", label: "VAT ID" },
  { key: "addr_street", label: "Street & no." },
  { key: "addr_zip", label: "Postal code" },
  { key: "addr_city", label: "City" },
  { key: "addr_country", label: "Country" },
  { key: "website", label: "Website" },
  { key: "contact_name", label: "Contact name" },
  { key: "contact_role", label: "Contact role" },
  { key: "contact_email", label: "Contact email" },
  { key: "contact_phone", label: "Contact phone" },
];

const MULTI: { group: string; label: string; options: { v: string; l: string }[] }[] = [
  {
    group: "ptype",
    label: "Product types",
    options: [
      { v: "single", l: "single" },
      { v: "bundle", l: "bundle" },
      { v: "training", l: "training" },
      { v: "license_pack", l: "license_pack" },
    ],
  },
  {
    group: "scenario",
    label: "Scenarios",
    options: [
      { v: "hotels", l: "Hotels" },
      { v: "clinics", l: "Clinics" },
      { v: "physio", l: "Physio" },
      { v: "wellness", l: "Wellness" },
      { v: "private", l: "Private" },
      { v: "retail", l: "Retail" },
      { v: "education", l: "Education" },
      { v: "kiosk", l: "Kiosk" },
    ],
  },
  {
    group: "platform",
    label: "Platforms",
    options: [
      { v: "web", l: "Web" },
      { v: "windows", l: "Windows" },
      { v: "macos", l: "macOS" },
      { v: "linux", l: "Linux" },
      { v: "iphone", l: "iPhone" },
      { v: "android", l: "Android" },
      { v: "raspberry", l: "Raspberry" },
      { v: "hifi", l: "HiFi-Amp" },
    ],
  },
];

export default function OnboardingAdmin() {
  const [text, setText] = useState<Record<string, string>>({});
  const [multi, setMulti] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  function toggle(group: string, v: string) {
    setMulti((prev) => {
      const cur = prev[group] ?? [];
      return { ...prev, [group]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
  }

  function generate() {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(text)) if (v.trim()) obj[k] = v.trim();
    for (const [g, arr] of Object.entries(multi)) if (arr.length) obj[g] = arr;
    if (notes.trim()) obj.notes = notes.trim();
    const url = `${window.location.origin}/onboarding?c=${toB64Url(obj)}`;
    setLink(url);
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <section className="shell pt-12 pb-6">
        <p className="eyebrow mb-3">Admin · Onboarding generator</p>
        <h1 className="display text-[clamp(2rem,7vw,4rem)] leading-[0.9]">
          Generate a<br />
          <span className="text-[var(--accent)]">prefilled link.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-dim)]">
          Fill in what you already know about the customer, generate a private link, and send it to
          them. The onboarding form opens prefilled — they complete the rest, upload documents, and
          submit (or download a signable PDF).
        </p>
      </section>

      <section className="shell pb-24 flex flex-col gap-6">
        <div className="onb-section">
          <h2 className="onb-section-title"><span className="onb-section-num">1</span>Known details</h2>
          <div className="onb-grid">
            {TEXT_FIELDS.map((f) => (
              <div key={f.key} className="form-field">
                <label className="form-label">{f.label}</label>
                <input
                  className="form-control"
                  placeholder={f.placeholder}
                  value={text[f.key] ?? ""}
                  onChange={(e) => setText((p) => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="onb-section">
          <h2 className="onb-section-title"><span className="onb-section-num">2</span>Preselect (optional)</h2>
          {MULTI.map((m) => (
            <fieldset key={m.group} className="onb-fieldset">
              <legend className="form-label">{m.label}</legend>
              <div className="onb-checks" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
                {m.options.map((o) => (
                  <label key={o.v} className="onb-chk">
                    <input
                      type="checkbox"
                      checked={(multi[m.group] ?? []).includes(o.v)}
                      onChange={() => toggle(m.group, o.v)}
                    />
                    <span>{o.l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="form-field mt-4">
            <label className="form-label">Notes for the customer record</label>
            <textarea className="form-control" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button type="button" className="btn btn-solid" onClick={generate}>
            Generate link
          </button>
          {link ? (
            <a href={link} className="btn" target="_blank" rel="noreferrer">
              Open form
            </a>
          ) : null}
        </div>

        {link ? (
          <div className="onb-section">
            <label className="form-label mb-2 block">Prefilled link</label>
            <div className="flex gap-3 flex-wrap items-center">
              <input className="form-control flex-1 min-w-[260px]" readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
              <button type="button" className="btn btn-sm btn-solid" onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <p className="form-footnote text-left mt-3">
              The link carries only the prefilled values you entered above (encoded in the URL). The
              customer still needs the onboarding password to open it.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
