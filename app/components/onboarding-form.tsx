"use client";

import { useRef, useState } from "react";

type Lang = "de" | "en";
type Prefill = Record<string, unknown>;
type Upload = { kind: string; name: string; pathname: string; size: number };
type State = "idle" | "loading" | "ok" | "error";

export default function OnboardingForm({ prefill = {} }: { prefill?: Prefill }) {
  const [lang, setLang] = useState<Lang>("de");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [uploadingKind, setUploadingKind] = useState<string | null>(null);
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const t = (de: string, en: string) => (lang === "de" ? de : en);

  // ---- prefill helpers ----
  const sv = (k: string): string | undefined =>
    typeof prefill[k] === "string" ? (prefill[k] as string) : undefined;
  const av = (k: string): string[] =>
    Array.isArray(prefill[k]) ? (prefill[k] as string[]) : [];
  const checked = (group: string, value: string) => av(group).includes(value);

  const company = sv("company_name") ?? "";

  // ---- file upload ----
  async function onFile(kind: string, files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingKind(kind);
    setMessage("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("kind", kind);
        fd.append("company", company || (sv("company_name") ?? "unknown"));
        const res = await fetch("/api/onboarding/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || "Upload failed");
        }
        const j = (await res.json()) as Upload;
        setUploads((prev) => [...prev, { kind, name: j.name, pathname: j.pathname, size: j.size }]);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingKind(null);
    }
  }

  function removeUpload(pathname: string) {
    setUploads((prev) => prev.filter((u) => u.pathname !== pathname));
  }

  // ---- submit ----
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const fields: Record<string, string | string[]> = {};
    for (const [k, v] of fd.entries()) {
      if (typeof v !== "string") continue;
      if (fields[k] === undefined) fields[k] = v;
      else {
        if (!Array.isArray(fields[k])) fields[k] = [fields[k] as string];
        (fields[k] as string[]).push(v);
      }
    }
    if (!fields.company_name || String(fields.company_name).trim() === "") {
      setState("error");
      setMessage(t("Bitte Firmennamen angeben.", "Please enter a company name."));
      return;
    }
    if (!fields.accept) {
      setState("error");
      setMessage(t("Bitte die Beta-Bedingungen bestätigen.", "Please accept the beta terms."));
      return;
    }
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, uploads }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Submit failed");
      }
      setState("ok");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Submit failed");
    }
  }

  const fmtSize = (b: number) =>
    b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`;

  if (state === "ok") {
    return (
      <section className="shell pt-20 pb-32 flex justify-center onb-screen-only">
        <div className="beta-form-shell w-full max-w-lg beta-form-success">
          <span className="beta-form-success-dot" aria-hidden />
          <p className="eyebrow mb-3">{t("Eingegangen", "Received")}</p>
          <h2 className="display text-[clamp(1.5rem,3vw,2.1rem)] text-[var(--ink)] leading-tight">
            {t("Danke — wir haben Ihre Angaben.", "Thanks — we've got your details.")}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-dim)]">
            {t(
              "Unser Team meldet sich in Kürze. Bei Bedarf können Sie jetzt auch eine unterschreibbare PDF herunterladen.",
              "Our team will be in touch shortly. You can also download a signable PDF now if you wish."
            )}
          </p>
          <button type="button" onClick={() => window.print()} className="btn mt-7 w-full justify-center">
            {t("Als PDF speichern", "Save as PDF")}
          </button>
        </div>
      </section>
    );
  }

  const uploadKinds: { key: string; de: string; en: string; multiple: boolean }[] = [
    { key: "price_list", de: "Preisliste", en: "Price list", multiple: false },
    { key: "datasheets", de: "Produktdatenblätter", en: "Product datasheets", multiple: true },
    { key: "logo", de: "Logo / Markenmaterial", en: "Logo / brand assets", multiple: true },
    { key: "other_docs", de: "Weitere Dokumente", en: "Other documents", multiple: true },
  ];

  return (
    <div className="onb-root">
      {/* ---------- language toggle ---------- */}
      <div className="shell pt-10 onb-screen-only">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="eyebrow">{t("Kunden-Onboarding", "Customer onboarding")}</p>
          <div className="onb-toggle" role="group" aria-label="Language">
            <button type="button" className={lang === "de" ? "active" : ""} onClick={() => setLang("de")}>
              Deutsch
            </button>
            <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
              English
            </button>
          </div>
        </div>
      </div>

      {/* ---------- header ---------- */}
      <section className="shell pt-6 pb-8">
        <h1 className="display text-[clamp(2.2rem,8vw,5rem)] leading-[0.9]">
          AudioCrypt
          <br />
          <span className="text-[var(--accent)]">{t("Partner-Aufnahme", "Partner onboarding")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-relaxed text-[var(--ink-dim)]">
          {t(
            "Dieses Formular erfasst alles, was wir brauchen, um Ihren Shop, Ihre Produkte und Ihren Vertrieb sauber über die AudioCrypt-Plattform aufzusetzen. Betrieben von NOMAD CODELABS LLC; Verkaufs- und Auslieferungsplattform ist audiocrypt.io.",
            "This form captures everything we need to set up your shop, products and sales cleanly on the AudioCrypt platform. Operated by NOMAD CODELABS LLC; the sales and delivery platform is audiocrypt.io."
          )}
        </p>
      </section>

      <form ref={formRef} onSubmit={onSubmit} className="shell pb-24 flex flex-col gap-6" noValidate>
        {/* 1 — Company */}
        <Section n="1" title={t("Verkaufendes Unternehmen", "Selling company")}
          desc={t("Die juristische Person, die offiziell verkauft (Rechnungen, AGB, Impressum).", "The legal entity that officially sells (invoices, terms, imprint).")}>
          <Grid>
            <Field full label={t("Offizieller Firmenname", "Official company name")} req>
              <input name="company_name" required defaultValue={sv("company_name")} className="form-control" />
            </Field>
            <Field label={t("Rechtsform", "Legal form")}>
              <input name="legal_form" defaultValue={sv("legal_form")} placeholder="GmbH, UG, LLC, e.K. …" className="form-control" />
            </Field>
            <Field label={t("Handelsregister-Nr.", "Commercial register no.")}>
              <input name="register_no" defaultValue={sv("register_no")} className="form-control" />
            </Field>
            <Field label={t("USt-IdNr. / VAT-ID", "VAT ID")}>
              <input name="vat_id" defaultValue={sv("vat_id")} className="form-control" />
            </Field>
            <Field label={t("Steuernummer", "Tax number")}>
              <input name="tax_no" defaultValue={sv("tax_no")} className="form-control" />
            </Field>
            <Field full label={t("Straße & Nr.", "Street & no.")} req>
              <input name="addr_street" required defaultValue={sv("addr_street")} className="form-control" />
            </Field>
            <Field label={t("PLZ", "Postal code")} req>
              <input name="addr_zip" required defaultValue={sv("addr_zip")} className="form-control" />
            </Field>
            <Field label={t("Ort", "City")} req>
              <input name="addr_city" required defaultValue={sv("addr_city")} className="form-control" />
            </Field>
            <Field label={t("Land", "Country")} req>
              <input name="addr_country" required defaultValue={sv("addr_country")} className="form-control" />
            </Field>
            <Field label="Website">
              <input name="website" type="url" defaultValue={sv("website")} placeholder="https://" className="form-control" />
            </Field>
          </Grid>
        </Section>

        {/* 2 — Contact */}
        <Section n="2" title={t("Ansprechpartner", "Primary contact")}
          desc={t("Hauptkontakt für Vertrag, Setup und Support.", "Main contact for contract, setup and support.")}>
          <Grid>
            <Field label={t("Vor- & Nachname", "Full name")} req>
              <input name="contact_name" required defaultValue={sv("contact_name")} className="form-control" />
            </Field>
            <Field label={t("Funktion / Rolle", "Role / position")}>
              <input name="contact_role" defaultValue={sv("contact_role")} className="form-control" />
            </Field>
            <Field label="E-Mail" req>
              <input name="contact_email" type="email" required defaultValue={sv("contact_email")} className="form-control" />
            </Field>
            <Field label={t("Telefon", "Phone")} req>
              <input name="contact_phone" type="tel" required defaultValue={sv("contact_phone")} className="form-control" />
            </Field>
            <Field label={t("Mobil", "Mobile")}>
              <input name="contact_mobile" type="tel" defaultValue={sv("contact_mobile")} className="form-control" />
            </Field>
            <Field label={t("Bevorzugte Sprache", "Preferred language")}>
              <div className="form-select-wrap">
                <select name="contact_lang" defaultValue={sv("contact_lang")} className="form-control form-select">
                  <option>Deutsch</option>
                  <option>English</option>
                  <option>Español</option>
                  <option>Français</option>
                  <option>Italiano</option>
                </select>
              </div>
            </Field>
          </Grid>
        </Section>

        {/* 3 — Banking */}
        <Section n="3" title={t("Bankverbindung & Auszahlung", "Banking & payouts")}
          desc={t("Für Auszahlungen Ihrer Erlöse. Abwicklung über Stripe oder Payoneer.", "For paying out your revenue. Processing via Stripe or Payoneer.")}>
          <Grid>
            <Field label={t("Kontoinhaber", "Account holder")}>
              <input name="bank_holder" defaultValue={sv("bank_holder")} className="form-control" />
            </Field>
            <Field label={t("Bankname", "Bank name")}>
              <input name="bank_name" defaultValue={sv("bank_name")} className="form-control" />
            </Field>
            <Field label="IBAN">
              <input name="bank_iban" defaultValue={sv("bank_iban")} className="form-control" />
            </Field>
            <Field label="BIC / SWIFT">
              <input name="bank_bic" defaultValue={sv("bank_bic")} className="form-control" />
            </Field>
            <Field label={t("Bevorzugte Abwicklung", "Preferred processor")}>
              <div className="form-select-wrap">
                <select name="payout_processor" defaultValue={sv("payout_processor")} className="form-control form-select">
                  <option>Wise</option>
                  <option>Stripe</option>
                  <option>Payoneer</option>
                  <option value="bank">Bank / SEPA</option>
                </select>
              </div>
            </Field>
            <Field label={t("Abrechnungswährung", "Settlement currency")}>
              <div className="form-select-wrap">
                <select name="currency" defaultValue={sv("currency")} className="form-control form-select">
                  <option>EUR</option>
                  <option>USD</option>
                </select>
              </div>
            </Field>
          </Grid>
          <p className="form-footnote mt-4 text-left">
            {t("Bankdaten optional bei Erst-Einreichung — kann auch separat erfasst werden.", "Bank details optional on first submission — can also be collected separately.")}
          </p>
        </Section>

        {/* 4 — Products */}
        <Section n="4" title={t("Produkte & Katalog", "Products & catalog")}
          desc={t("Produkttypen entsprechen den Plattform-Kategorien.", "Product types match the platform categories.")}>
          <CheckGroup legend={t("Produkttypen", "Product types")} cols={2}>
            <Chk name="ptype" value="single" checked={checked("ptype", "single")} label={t("Einzeltitel (single)", "Single title (single)")} />
            <Chk name="ptype" value="bundle" checked={checked("ptype", "bundle")} label={t("Bündel / Album (bundle)", "Bundle / album (bundle)")} />
            <Chk name="ptype" value="training" checked={checked("ptype", "training")} label={t("Kurs / Training (training)", "Course / training (training)")} />
            <Chk name="ptype" value="license_pack" checked={checked("ptype", "license_pack")} label={t("Lizenzpaket (license_pack)", "License pack (license_pack)")} />
          </CheckGroup>
          <Grid className="mt-4">
            <Field full label={t("Art der Inhalte", "Type of content")}>
              <input name="content_kind" defaultValue={sv("content_kind")} placeholder={t("Hörbücher, Musik, Therapie-Audio, Schulungen …", "Audiobooks, music, therapy audio, courses …")} className="form-control" />
            </Field>
            <Field label={t("Anzahl Produkte (ca.)", "Number of products (approx.)")}>
              <input name="catalog_size" type="number" min={0} defaultValue={sv("catalog_size")} className="form-control" />
            </Field>
            <Field label={t("Preisspanne pro Produkt", "Price range per product")}>
              <input name="price_range" defaultValue={sv("price_range")} placeholder={t("z.B. 9–99 EUR", "e.g. 9–99 EUR")} className="form-control" />
            </Field>
          </Grid>
          <CheckGroup legend={t("Inhaltssprachen", "Content languages")} cols={3} className="mt-4">
            <Chk name="clang" value="de" checked={checked("clang", "de")} label="Deutsch (de)" />
            <Chk name="clang" value="en" checked={checked("clang", "en")} label="English (en)" />
            <Chk name="clang" value="es" checked={checked("clang", "es")} label="Español (es)" />
            <Chk name="clang" value="fr" checked={checked("clang", "fr")} label="Français (fr)" />
            <Chk name="clang" value="it" checked={checked("clang", "it")} label="Italiano (it)" />
          </CheckGroup>
        </Section>

        {/* 5 — Scenarios */}
        <Section n="5" title={t("Einsatzszenarien", "Usage scenarios")}
          desc={t("Wo und wie werden Ihre Produkte abgespielt? Mehrfachauswahl.", "Where and how will your products be played? Multiple choice.")}>
          <CheckGroup legend={t("Erwartete Szenarien", "Expected scenarios")} cols={2}>
            <Chk name="scenario" value="hotels" checked={checked("scenario", "hotels")} label={t("Hotels", "Hotels")} />
            <Chk name="scenario" value="clinics" checked={checked("scenario", "clinics")} label={t("Kliniken", "Clinics")} />
            <Chk name="scenario" value="physio" checked={checked("scenario", "physio")} label={t("Physiotherapie-Praxen", "Physiotherapy practices")} />
            <Chk name="scenario" value="wellness" checked={checked("scenario", "wellness")} label={t("Wellness / Spa", "Wellness / spa")} />
            <Chk name="scenario" value="private" checked={checked("scenario", "private")} label={t("Privatverkäufe", "Private sales")} />
            <Chk name="scenario" value="retail" checked={checked("scenario", "retail")} label={t("Einzelhandel / Wiederverkauf", "Retail / resale")} />
            <Chk name="scenario" value="education" checked={checked("scenario", "education")} label={t("Bildung / Schulung", "Education / training")} />
            <Chk name="scenario" value="kiosk" checked={checked("scenario", "kiosk")} label={t("Kiosk / Installation vor Ort", "Kiosk / on-site")} />
          </CheckGroup>
          <Field full label={t("Weitere / spezielle Szenarien", "Other / special scenarios")} className="mt-4">
            <textarea name="scenario_other" defaultValue={sv("scenario_other")} rows={3} className="form-control" />
          </Field>
        </Section>

        {/* 6 — Players / platforms */}
        <Section n="6" title={t("Benötigte Player & Plattformen", "Required players & platforms")}
          desc={t("AudioCrypt-Player gibt es als Web-, Desktop- und Mobile-App; Wiedergabe ist offline-fähig.", "AudioCrypt players exist as web, desktop and mobile apps; playback is offline-capable.")}>
          <CheckGroup legend={t("Plattformen", "Platforms")} cols={2}>
            <Chk name="platform" value="web" checked={checked("platform", "web")} label={t("Web-Browser (app.audiocrypt.io)", "Web browser (app.audiocrypt.io)")} />
            <Chk name="platform" value="windows" checked={checked("platform", "windows")} label="Windows (Desktop)" />
            <Chk name="platform" value="macos" checked={checked("platform", "macos")} label="macOS (Desktop)" />
            <Chk name="platform" value="linux" checked={checked("platform", "linux")} label="Linux (Desktop)" />
            <Chk name="platform" value="iphone" checked={checked("platform", "iphone")} label="iPhone / iOS" />
            <Chk name="platform" value="android" checked={checked("platform", "android")} label="Android" />
            <Chk name="platform" value="raspberry" checked={checked("platform", "raspberry")} label={t("Raspberry Pi / Embedded-Kiosk", "Raspberry Pi / embedded kiosk")} />
            <Chk name="platform" value="hifi" checked={checked("platform", "hifi")} label={t("App-integrierter HiFi-Amp", "App-integrated HiFi amp")} />
          </CheckGroup>
          <Grid className="mt-4">
            <Field label={t("App-integrierter HiFi-Amp gewünscht?", "App-integrated HiFi amp desired?")}>
              <div className="form-select-wrap">
                <select name="hifi_wanted" defaultValue={sv("hifi_wanted")} className="form-control form-select">
                  <option value="">—</option>
                  <option value="yes">{t("Ja", "Yes")}</option>
                  <option value="no">{t("Nein", "No")}</option>
                  <option value="maybe">{t("Später / unsicher", "Later / unsure")}</option>
                </select>
              </div>
            </Field>
            <Field label={t("Offline-Wiedergabe wichtig?", "Offline playback important?")}>
              <div className="form-select-wrap">
                <select name="offline_needed" defaultValue={sv("offline_needed")} className="form-control form-select">
                  <option value="">—</option>
                  <option value="critical">{t("Kritisch", "Critical")}</option>
                  <option value="nice">{t("Gut zu haben", "Nice to have")}</option>
                  <option value="no">{t("Nicht nötig", "Not needed")}</option>
                </select>
              </div>
            </Field>
            <Field full label={t("Speziallösungen / besondere Hardware", "Special solutions / dedicated hardware")}>
              <textarea name="special_hw" defaultValue={sv("special_hw")} rows={3} placeholder={t("z.B. vorinstallierte Geräte, Touch-Terminals, In-Room-Player …", "e.g. pre-installed devices, touch terminals, in-room players …")} className="form-control" />
            </Field>
          </Grid>
        </Section>

        {/* 7 — Hardware */}
        <Section n="7" title={t("Hardware & Versand", "Hardware & fulfillment")}
          desc={t("Ziel: später alles inkl. Hardware über die Plattform verkaufen und direkt versenden.", "Goal: eventually sell everything incl. hardware via the platform and ship directly.")}>
          <Grid>
            <Field label={t("Hardware über AudioCrypt beziehen?", "Source hardware via AudioCrypt?")}>
              <div className="form-select-wrap">
                <select name="hw_wanted" defaultValue={sv("hw_wanted")} className="form-control form-select">
                  <option value="">—</option>
                  <option value="yes">{t("Ja", "Yes")}</option>
                  <option value="no">{t("Nein", "No")}</option>
                  <option value="later">{t("Später", "Later")}</option>
                </select>
              </div>
            </Field>
            <Field label={t("Geschätzte Stückzahl Geräte", "Estimated device quantity")}>
              <input name="hw_qty" type="number" min={0} defaultValue={sv("hw_qty")} className="form-control" />
            </Field>
            <Field full label={t("Lieferadresse (falls abweichend)", "Shipping address (if different)")}>
              <textarea name="ship_addr" defaultValue={sv("ship_addr")} rows={2} className="form-control" />
            </Field>
          </Grid>
        </Section>

        {/* 8 — Volume */}
        <Section n="8" title={t("Volumen & Go-Live", "Volume & go-live")}>
          <Grid>
            <Field label={t("Erwartete Kundenzahl (12 Mon.)", "Expected customers (12 mo.)")}>
              <input name="exp_customers" type="number" min={0} defaultValue={sv("exp_customers")} className="form-control" />
            </Field>
            <Field label={t("Erwartetes Verkaufsvolumen", "Expected sales volume")}>
              <input name="exp_volume" defaultValue={sv("exp_volume")} placeholder={t("z.B. 500 Verkäufe / Monat", "e.g. 500 sales / month")} className="form-control" />
            </Field>
            <Field label={t("Gewünschter Start", "Desired launch date")}>
              <input name="golive" type="date" defaultValue={sv("golive")} className="form-control" />
            </Field>
            <Field full label={t("Sonstige Anforderungen / Wünsche", "Other requirements / notes")}>
              <textarea name="notes" defaultValue={sv("notes")} rows={3} className="form-control" />
            </Field>
          </Grid>
        </Section>

        {/* 9 — Uploads */}
        <Section n="9" title={t("Dokumente & Uploads", "Documents & uploads")}
          desc={t("Preisliste, Produktdatenblätter, Logo und weitere Unterlagen (PDF, Bilder, Excel, Word — max. 25 MB pro Datei).", "Price list, product datasheets, logo and other materials (PDF, images, Excel, Word — max 25 MB per file).")}>
          <div className="flex flex-col gap-4 onb-screen-only">
            {uploadKinds.map((u) => (
              <div key={u.key} className="onb-upload">
                <label className="form-label mb-1 block">{t(u.de, u.en)}</label>
                <input
                  type="file"
                  multiple={u.multiple}
                  className="onb-file"
                  disabled={uploadingKind !== null}
                  onChange={(e) => {
                    onFile(u.key, e.target.files);
                    e.target.value = "";
                  }}
                />
                {uploadingKind === u.key ? (
                  <span className="text-[12px] text-[var(--accent)]">{t("Lädt hoch…", "Uploading…")}</span>
                ) : null}
              </div>
            ))}
            {uploads.length > 0 ? (
              <ul className="onb-uploads-list">
                {uploads.map((u) => (
                  <li key={u.pathname}>
                    <span className="text-[var(--ink-dim)] text-[11px] uppercase tracking-[0.12em] mr-2">{u.kind}</span>
                    <span className="text-[var(--ink)]">{u.name}</span>
                    <span className="text-[var(--ink-faint)] text-[12px] ml-2">{fmtSize(u.size)}</span>
                    <button type="button" className="onb-remove" onClick={() => removeUpload(u.pathname)} aria-label="remove">
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <p className="onb-print-only form-footnote text-left">
            {t("Dokumente bitte separat per E-Mail an hello@audiocrypt.io senden.", "Please send documents separately by email to hello@audiocrypt.io.")}
          </p>
        </Section>

        {/* 10 — Liability */}
        <Section n="10" title={t("Haftung & Beta-Bedingungen", "Liability & beta terms")}>
          <div className="onb-warn">
            <strong>{t("⚠ Alpha/Beta-Hinweis", "⚠ Alpha/beta notice")}</strong>
            <br />
            {t(
              "Die AudioCrypt-Plattform befindet sich in der Alpha-/Beta-Phase. Funktionen können sich ändern, ausfallen oder Fehler enthalten. NOMAD CODELABS LLC übernimmt in dieser Phase keine Gewährleistung und keine Haftung für Schäden, Datenverluste oder entgangene Umsätze. Die Nutzung erfolgt auf eigenes Risiko.",
              "The AudioCrypt platform is in alpha/beta. Features may change, fail or contain bugs. During this phase NOMAD CODELABS LLC provides no warranty and accepts no liability for damages, data loss or lost revenue. Use is at your own risk."
            )}
          </div>

          <div className="onb-legal">
            {lang === "de" ? <LegalDE /> : <LegalEN />}
          </div>

          <label className="onb-ack">
            <input type="checkbox" name="accept" value="yes" defaultChecked={checked("accept", "yes")} />
            <span>
              {t(
                "Ich habe den Alpha/Beta-Hinweis und die Beta-Bedingungen gelesen und akzeptiere sie im Namen des oben genannten Unternehmens.",
                "I have read and accept the alpha/beta notice and the beta terms on behalf of the company named above."
              )}{" "}
              *
            </span>
          </label>

          <Grid className="mt-4">
            <Field label={t("Name (Unterzeichner)", "Name (signatory)")}>
              <input name="sign_name" defaultValue={sv("sign_name") ?? sv("contact_name")} className="form-control" />
            </Field>
            <Field label={t("Funktion", "Position")}>
              <input name="sign_role" defaultValue={sv("sign_role")} className="form-control" />
            </Field>
            <Field label={t("Ort", "Place")}>
              <input name="sign_place" defaultValue={sv("sign_place")} className="form-control" />
            </Field>
            <Field label={t("Datum", "Date")}>
              <input name="sign_date" type="date" defaultValue={sv("sign_date")} className="form-control" />
            </Field>
          </Grid>
          <div className="onb-sigline">{t("Unterschrift", "Signature")}</div>
        </Section>

        {/* actions */}
        {message ? (
          <p className="form-error" role="alert">{message}</p>
        ) : null}
        <div className="flex flex-wrap gap-4 onb-screen-only">
          <button type="submit" disabled={state === "loading"} className="btn btn-solid disabled:opacity-60">
            {state === "loading" ? t("Senden…", "Sending…") : t("Absenden", "Submit")}
          </button>
          <button type="button" onClick={() => window.print()} className="btn">
            {t("Als PDF herunterladen / drucken", "Download / print as PDF")}
          </button>
        </div>
        <p className="form-footnote text-left onb-screen-only">
          {t(
            "Tipp: „Als PDF herunterladen“ erzeugt eine unterschreibbare Fassung, die Sie an hello@audiocrypt.io senden können.",
            "Tip: “Download as PDF” produces a signable version you can email to hello@audiocrypt.io."
          )}
        </p>
      </form>
    </div>
  );
}

/* ---------- layout helpers ---------- */
function Section({
  n, title, desc, children,
}: { n: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="onb-section">
      <h2 className="onb-section-title">
        <span className="onb-section-num">{n}</span>
        {title}
      </h2>
      {desc ? <p className="onb-section-desc">{desc}</p> : null}
      {children}
    </section>
  );
}

function Grid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`onb-grid ${className}`.trim()}>{children}</div>;
}

function Field({
  label, children, full, req, className = "",
}: { label: string; children: React.ReactNode; full?: boolean; req?: boolean; className?: string }) {
  return (
    <div className={`form-field ${full ? "onb-col-full" : ""} ${className}`.trim()}>
      <label className="form-label">
        {label} {req ? <span className="onb-req">*</span> : null}
      </label>
      {children}
    </div>
  );
}

function CheckGroup({
  legend, children, cols = 2, className = "",
}: { legend: string; children: React.ReactNode; cols?: number; className?: string }) {
  return (
    <fieldset className={`onb-fieldset ${className}`.trim()}>
      <legend className="form-label">{legend}</legend>
      <div className="onb-checks" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {children}
      </div>
    </fieldset>
  );
}

function Chk({
  name, value, label, checked,
}: { name: string; value: string; label: string; checked?: boolean }) {
  return (
    <label className="onb-chk">
      <input type="checkbox" name={name} value={value} defaultChecked={checked} />
      <span>{label}</span>
    </label>
  );
}

/* ---------- legal clauses ---------- */
function LegalDE() {
  return (
    <>
      <h3>§1 Vertragsparteien</h3>
      <p>Diese Beta-Vereinbarung wird geschlossen zwischen <strong>NOMAD CODELABS LLC</strong> („Anbieter“, Betreiber der Plattform audiocrypt.io) und dem oben angegebenen Unternehmen („Partner“/„Kunde“).</p>
      <h3>§2 Gegenstand & Beta-Status</h3>
      <p>Der Anbieter stellt dem Partner die AudioCrypt-Plattform in einer Alpha-/Beta-Vorabversion zur Verfügung. Es handelt sich ausdrücklich um eine in Entwicklung befindliche Software, die nicht den Reifegrad einer finalen Produktversion hat.</p>
      <h3>§3 Gewährleistungsausschluss</h3>
      <p>Die Plattform wird „wie besehen“ und „wie verfügbar“ bereitgestellt. Eine bestimmte Verfügbarkeit, Fehlerfreiheit, Eignung für einen bestimmten Zweck oder durchgehende Funktion wird nicht zugesichert. Soweit gesetzlich zulässig, sind sämtliche ausdrücklichen und stillschweigenden Gewährleistungen ausgeschlossen.</p>
      <h3>§4 Haftungsbeschränkung</h3>
      <p>Der Anbieter haftet während der Beta-Phase nicht für mittelbare Schäden, Folgeschäden, Datenverluste, entgangenen Gewinn oder Betriebsunterbrechungen. Eine etwaige Haftung ist – soweit gesetzlich zulässig – auf Vorsatz und grobe Fahrlässigkeit beschränkt. Zwingende gesetzliche Haftung (z. B. nach Produkthaftungsgesetz oder bei Verletzung von Leben, Körper, Gesundheit) bleibt unberührt.</p>
      <h3>§5 Daten & Sicherung</h3>
      <p>Audioinhalte werden mit AES-256-GCM verschlüsselt gespeichert; Lizenzen werden serverseitig signiert (RS256) und sind offline prüfbar. Der Partner bleibt für eigene Sicherungskopien seiner Originalinhalte verantwortlich.</p>
      <h3>§6 Datenschutz</h3>
      <p>Die Parteien verpflichten sich zur Einhaltung der DSGVO. Soweit personenbezogene Daten im Auftrag verarbeitet werden, wird ein gesonderter Auftragsverarbeitungsvertrag (AVV) geschlossen.</p>
      <h3>§7 Laufzeit</h3>
      <p>Die Beta-Vereinbarung läuft bis zum allgemeinen Produktstart oder bis zur Kündigung durch eine Partei mit angemessener Frist. Mit dem Produktstart gelten die dann veröffentlichten regulären Bedingungen.</p>
      <h3>§8 Vertraulichkeit</h3>
      <p>Beide Parteien behandeln nicht-öffentliche Informationen aus der Zusammenarbeit vertraulich.</p>
    </>
  );
}

function LegalEN() {
  return (
    <>
      <h3>§1 Parties</h3>
      <p>This beta agreement is entered into between <strong>NOMAD CODELABS LLC</strong> (“Provider”, operator of the audiocrypt.io platform) and the company named above (“Partner”/“Customer”).</p>
      <h3>§2 Subject & beta status</h3>
      <p>The Provider makes the AudioCrypt platform available to the Partner as an alpha/beta pre-release. This is expressly software under development that has not reached the maturity of a final product release.</p>
      <h3>§3 Disclaimer of warranties</h3>
      <p>The platform is provided “as is” and “as available”. No specific availability, freedom from defects, fitness for a particular purpose or continuous operation is warranted. To the extent permitted by law, all express and implied warranties are excluded.</p>
      <h3>§4 Limitation of liability</h3>
      <p>During the beta phase the Provider is not liable for indirect or consequential damages, data loss, lost profit or business interruption. Any liability is — to the extent permitted by law — limited to intent and gross negligence. Mandatory statutory liability (e.g. product liability, or injury to life, body or health) remains unaffected.</p>
      <h3>§5 Data & backups</h3>
      <p>Audio content is stored encrypted with AES-256-GCM; licenses are server-signed (RS256) and verifiable offline. The Partner remains responsible for its own backups of original content.</p>
      <h3>§6 Data protection</h3>
      <p>The parties undertake to comply with the GDPR. Where personal data is processed on behalf of the Partner, a separate data processing agreement (DPA) will be concluded.</p>
      <h3>§7 Term</h3>
      <p>The beta agreement runs until the general product launch or until termination by either party with reasonable notice. Upon launch, the then-published regular terms apply.</p>
      <h3>§8 Confidentiality</h3>
      <p>Both parties keep non-public information from the cooperation confidential.</p>
    </>
  );
}
