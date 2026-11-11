"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import { CONTACT } from "@/lib/site";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

/**
 * ENQUIRY FORM — one question at a time.
 *
 * A white sheet lifted off a soft grey band. Instead of a wall of fields it
 * asks a single, large question per step, so there is only ever one thing to
 * look at: what it is about → your name → how to reach you → anything else.
 * Enter moves on, a thin gold bar shows how far along you are.
 */

/** What the enquiry is about. Keys match the `topic` query used across the site. */
const TOPICS = [
  { key: "commercial", label: "Commercial project", hint: "Offices, retail, hospitality." },
  { key: "residential", label: "Residential build", hint: "A new home — grey structure to turnkey." },
  { key: "buy", label: "Buy a home", hint: "Find a home that is ready to move into." },
  { key: "sell", label: "Sell a home", hint: "A valuation, and a sale handled end to end." },
  { key: "site-visit", label: "Visit an ongoing site", hint: "See one of our projects in person." },
  { key: "general", label: "Something else", hint: "Any other question — just ask." },
] as const;

type TopicKey = (typeof TOPICS)[number]["key"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (s: string) => s.replace(/\D/g, "");

const STEPS = ["Topic", "Name", "Contact", "Message"] as const;

const lineCls =
  "w-full bg-transparent pb-3 pt-2 font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-normal text-[#11141b] placeholder:text-[#9aa0ab] outline-none";

/** A big input on a hairline that draws itself gold on focus (red on error). */
function Line({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[rgba(20,33,61,0.28)]" />
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-[2px] origin-left transition-transform duration-500 ease-[var(--ease-luxe)] ${
          error ? "[transform:scaleX(1)] bg-[#b4452f]" : "[transform:scaleX(0)] bg-[#b58c49] group-focus-within:[transform:scaleX(1)]"
        }`}
      />
    </div>
  );
}

export default function Inquiry() {
  const rootRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<TopicKey>("residential");
  const [data, setData] = useState({ name: "", email: "", phone: "", message: "" });
  const [error, setError] = useState<string>("");
  const moved = useRef(false);

  // Read in an effect rather than useSearchParams, so the page stays fully
  // static; the buttons that link here set ?topic= and optionally ?about=.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const match = TOPICS.find((t) => t.key === q.get("topic"));
    if (match) setTopic(match.key);
    const about = q.get("about");
    if (about) setData((d) => ({ ...d, message: d.message || `Regarding: ${about}\n` }));
  }, []);

  // Put the cursor in the new step's field (but not on first load).
  useEffect(() => {
    if (!moved.current) return;
    const id = ["", "inq-name", "inq-phone", "inq-message"][step];
    if (id) document.getElementById(id)?.focus({ preventScroll: true });
  }, [step]);

  const set = (field: keyof typeof data) => (value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    setError("");
  };

  /** Returns an error message if the current step is not complete. */
  const check = (s: number): string => {
    if (s === 1 && !data.name.trim()) return "Please tell us your name.";
    if (s === 2) {
      const hasPhone = data.phone.trim().length > 0;
      const hasEmail = data.email.trim().length > 0;
      if (!hasPhone && !hasEmail) return "Please give us a phone number or an email address.";
      if (hasPhone && digits(data.phone).length < 9) return "That phone number looks too short.";
      if (hasEmail && !EMAIL_RE.test(data.email.trim())) return "That email address does not look right.";
    }
    return "";
  };

  const go = (to: number) => {
    moved.current = true;
    setError("");
    setStep(to);
  };

  const next = () => {
    const msg = check(step);
    if (msg) return setError(msg);
    go(Math.min(STEPS.length - 1, step + 1));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    // Last step: re-check everything before sending.
    for (const s of [1, 2]) {
      const msg = check(s);
      if (msg) {
        go(s);
        setError(msg);
        return;
      }
    }
    setSent(true);
  };

  useIntroLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".inq-narrative",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: root, start: "top 78%", once: true } }
      );
      gsap.fromTo(
        ".inq-card",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: root, start: "top 80%", once: true } }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const topicInfo = TOPICS.find((t) => t.key === topic)!;
  const reachLabel =
    data.phone.trim() && data.email.trim() ? "phone or email" : data.phone.trim() ? "phone or WhatsApp" : "email";

  const question = [
    "What brings you to us?",
    "What should we call you?",
    "How can we reach you?",
    "Anything we should know?",
  ][step];

  return (
    <section ref={rootRef} id="inquire" data-depth="raised" className="relative bg-[#f5f6f8] py-[var(--section-y)] text-[#11141b]">
      <div className="u-shell">
        <SectionLabel label="Enquiries" />

        <div className="mt-14 grid gap-y-16 lg:grid-cols-12 lg:gap-x-16">
          {/* Left: narrative + direct lines */}
          <div className="inq-narrative col-span-full lg:col-span-5">
            <span className="mb-4 block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">Get in Touch</span>
            <TextReveal
              as="h2"
              className="u-display font-serif text-[clamp(2rem,3.8vw,3.1rem)] font-light leading-[1.12] text-[#11141b]"
              lines={["Tell us what", "you are", <em key="e" className="font-serif font-normal italic text-[#D8B479]">planning.</em>]}
            />
            <p className="mt-7 max-w-md text-[1rem] leading-[1.8] text-[#4b5563]">
              Whether you are building, buying or selling, start here. A member of our team will reply within one working day.
            </p>

            <div className="mt-11 space-y-6 pt-9 shadow-[inset_0_1px_0_rgba(20,33,61,0.1)]">
              {[
                { label: "Call", value: CONTACT.phone, href: CONTACT.phoneHref },
                { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              ].map((c) => (
                <a key={c.label} href={c.href} className="group block w-fit">
                  <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-[#4b5563]">{c.label}</span>
                  <span className="mt-1.5 block font-serif text-[1.4rem] font-light leading-none text-[#11141b] transition-colors duration-300 group-hover:text-[#b58c49]">
                    {c.value}
                  </span>
                </a>
              ))}
              <p className="text-[0.82rem] text-[#4b5563]">{CONTACT.hours}</p>
            </div>
          </div>

          {/* Right: the sheet */}
          <div className="inq-card col-span-full lg:col-span-7">
            <div
              ref={sheetRef}
              className="relative flex min-h-[27rem] sm:min-h-[30rem] flex-col bg-white px-[clamp(1.35rem,4.5vw,3.5rem)] py-[clamp(1.75rem,4.5vw,3.25rem)] shadow-[0_50px_90px_-50px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.04)]"
            >
              {sent ? (
                <div role="status" className="my-auto">
                  <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full bg-[#000000] text-[#D8B479]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <h3 className="mt-8 font-serif text-[clamp(2.1rem,3.6vw,2.9rem)] font-light leading-[1.12]">
                    Thank you{data.name.trim() ? `, ${data.name.trim().split(" ")[0]}` : ""}.
                  </h3>
                  <p className="mt-5 max-w-md text-[1rem] leading-[1.8] text-[#4b5563]">
                    Your enquiry has reached our team. We will be in touch within one working day.
                  </p>
                  <p className="mt-8 text-[0.9rem] text-[#4b5563]">
                    <span className="text-[#11141b]">{topicInfo.label}</span> · we will contact you by {reachLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      go(0);
                    }}
                    className="u-btn u-btn--line u-btn--sm mt-9"
                  >
                    <span>Send another enquiry</span>
                    <span aria-hidden="true" className="u-btn__arrow" />
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
                  {/* Progress */}
                  <div className="flex items-center gap-5">
                    <span className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#4b5563]">
                      Step {step + 1} <span className="text-[#9aa0ab]">/ {STEPS.length}</span>
                    </span>
                    <div className="flex flex-1 gap-1.5" aria-hidden="true">
                      {STEPS.map((s, i) => (
                        <span key={s} className="relative h-[2px] flex-1 bg-[rgba(20,33,61,0.1)]">
                          <span
                            className="absolute inset-0 origin-left bg-[#b58c49] transition-transform duration-700 ease-[var(--ease-luxe)]"
                            style={{ transform: `scaleX(${i <= step ? 1 : 0})` }}
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* The one question */}
                  <div key={step} className="u-fade-up mt-9 flex-1 sm:mt-12">
                    <h3 id="inq-q" className="font-serif text-[clamp(1.9rem,3.4vw,2.7rem)] font-light leading-[1.1] tracking-[-0.01em]">
                      {question}
                    </h3>

                    {step === 0 && (
                      <>
                        <div role="radiogroup" aria-labelledby="inq-q" className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-9 sm:flex sm:flex-wrap">
                          {TOPICS.map((t) => {
                            const on = topic === t.key;
                            return (
                              <label key={t.key} className="flex cursor-pointer">
                                <input
                                  type="radio"
                                  name="topic"
                                  value={t.key}
                                  checked={on}
                                  onChange={() => setTopic(t.key)}
                                  className="peer sr-only"
                                />
                                <span
                                  className={[
                                    "flex w-full items-center justify-center rounded-full px-3 py-3 text-center text-[0.82rem] font-medium transition-colors sm:px-5 sm:text-[0.85rem] duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#b58c49]",
                                    on ? "bg-[#000000] text-white" : "bg-[#f1f2f5] text-[#2a303b] hover:bg-[#e6e8ec]",
                                  ].join(" ")}
                                >
                                  {t.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        <p key={topic} className="u-fade-up mt-5 text-[0.92rem] text-[#4b5563]">
                          {topicInfo.hint}
                        </p>
                      </>
                    )}

                    {step === 1 && (
                      <div className="mt-10 max-w-lg">
                        <Line error={error}>
                          <input
                            id="inq-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            aria-labelledby="inq-q"
                            value={data.name}
                            onChange={(e) => set("name")(e.target.value)}
                            placeholder="Your full name"
                            aria-invalid={!!error}
                            className={lineCls}
                          />
                        </Line>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="mt-10 grid max-w-xl gap-x-10 gap-y-9 sm:grid-cols-2">
                        <div>
                          <label htmlFor="inq-phone" className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#4b5563]">
                            Phone / WhatsApp
                          </label>
                          <Line error={error}>
                            <input
                              id="inq-phone"
                              name="phone"
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel"
                              value={data.phone}
                              onChange={(e) => set("phone")(e.target.value)}
                              placeholder="+92 3XX XXXXXXX"
                              aria-invalid={!!error}
                              className={lineCls}
                            />
                          </Line>
                        </div>
                        <div>
                          <label htmlFor="inq-email" className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#4b5563]">
                            Or email
                          </label>
                          <Line error={error}>
                            <input
                              id="inq-email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              value={data.email}
                              onChange={(e) => set("email")(e.target.value)}
                              placeholder="name@email.com"
                              aria-invalid={!!error}
                              className={lineCls}
                            />
                          </Line>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="mt-10">
                        <Line>
                          <textarea
                            id="inq-message"
                            name="message"
                            rows={3}
                            aria-labelledby="inq-q"
                            value={data.message}
                            onChange={(e) => set("message")(e.target.value)}
                            placeholder="Plot size and location, what you want to build, your timeline… (optional)"
                            className={`${lineCls} min-h-[7rem] resize-none text-[clamp(1.2rem,2vw,1.5rem)] [field-sizing:content] leading-[1.5]`}
                          />
                        </Line>
                      </div>
                    )}

                    {error && (
                      <p role="alert" className="mt-5 text-[0.88rem] text-[#b4452f]">
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="mt-10 flex flex-col-reverse items-stretch gap-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => go(step - 1)}
                        className="self-center py-1 text-[0.66rem] font-medium uppercase tracking-[0.24em] text-[#4b5563] transition-colors hover:text-[#11141b] sm:self-auto"
                      >
                        ← Back
                      </button>
                    ) : (
                      <span className="text-center text-[0.62rem] uppercase tracking-[0.2em] text-[#8a8f9a] sm:text-left sm:text-[0.66rem]">We reply within one working day</span>
                    )}

                    {step < STEPS.length - 1 ? (
                      <button key="next" type="button" onClick={next} className="u-btn u-btn--dark w-full shrink-0 justify-between sm:w-auto">
                        <span>Continue</span>
                        <span aria-hidden="true" className="u-btn__arrow" />
                      </button>
                    ) : (
                      <button key="send" type="submit" className="u-btn u-btn--gold w-full shrink-0 justify-between sm:w-auto">
                        <span>Send enquiry</span>
                        <span aria-hidden="true" className="u-btn__arrow" />
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
