"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap, prefersReducedMotion } from"@/lib/gsap";
import SectionLabel from"@/components/ui/SectionLabel";
import TextReveal from"@/components/ui/TextReveal";
import MagneticButton from"@/components/ui/MagneticButton";
import { CONTACT } from"@/lib/site";
import { useIntroLayoutEffect } from "@/lib/useIntroLayoutEffect";

/** What the enquiry is about. Keys match the `topic` query used across the site. */
const ENQUIRY_TYPES = [
  { key:"commercial", label:"Commercial project" },
  { key:"residential", label:"Residential build" },
  { key:"buy", label:"Buy a home" },
  { key:"sell", label:"Sell a home" },
  { key:"site-visit", label:"Visit an ongoing site" },
  { key:"general", label:"Something else" },
] as const;

const CONTACT_PREFS = ["Phone call","WhatsApp","Email"];

export default function Inquiry() {
 const rootRef = useRef<HTMLElement>(null);
 const [sent, setSent] = useState(false);
 const [viewingType, setViewingType] = useState<string>(ENQUIRY_TYPES[1].label);
 const [timeSlot, setTimeSlot] = useState(CONTACT_PREFS[0]);
 const [formData, setFormData] = useState({ name:"", email:"", phone:"", message:"" });

 // Read in an effect rather than useSearchParams, so the page stays fully
 // static; the buttons that link here set ?topic= and optionally ?about=.
 useEffect(() => {
 const q = new URLSearchParams(window.location.search);
 const match = ENQUIRY_TYPES.find((t) => t.key === q.get("topic"));
 if (match) setViewingType(match.label);
 const about = q.get("about");
 if (about) setFormData((f) => ({ ...f, message: f.message || `Regarding: ${about}\n` }));
  }, []);

 const onSubmit = (e: FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 setSent(true);
  };

 useIntroLayoutEffect(() => {
 const root = rootRef.current;
 if (!root || prefersReducedMotion()) return;

 const ctx = gsap.context(() => {
      // Narrative entrance
 gsap.fromTo(
".inq-narrative",
        { opacity: 0, y: 30 },
        {
 opacity: 1,
 y: 0,
 duration: 1.1,
 ease:"power3.out",
 scrollTrigger: {
 trigger: root,
 start:"top 78%",
 once: true,
          },
        }
      );

      // Form card entrance
 gsap.fromTo(
".inq-card",
        { opacity: 0, y: 35, scale: 0.97 },
        {
 opacity: 1,
 y: 0,
 scale: 1,
 duration: 1.2,
 ease:"power3.out",
 scrollTrigger: {
 trigger: root,
 start:"top 80%",
 once: true,
          },
        }
      );
    }, root);

 return () => ctx.revert();
  }, []);

 return (
    <section
 ref={rootRef}
 id="inquire"
 data-depth="raised"
 className="py-[var(--section-y)] relative bg-[#ffffff] text-[#11141b]"
    >
      <div className="u-shell">
        <SectionLabel label="Enquiries" />

        <div className="mt-14 grid gap-y-16 lg:grid-cols-12 lg:gap-x-20">
          {/* Left Narrative */}
          <div className="inq-narrative col-span-full lg:col-span-5">
            <span className="text-xs sm:text-sm tracking-[0.28em] uppercase text-[#b58c49] font-bold block mb-3">
              Get in Touch
            </span>
            <TextReveal
 as="h2"
 className="u-display text-3xl sm:text-4xl lg:text-5xl text-[#11141b] font-normal leading-[1.08]"
 lines={["Tell us what","you are", <em key="e" className="font-serif italic font-normal text-[#D8B479]">planning.</em>]}
            />
            <p className="mt-8 text-lg sm:text-xl text-[#1f2937] leading-relaxed font-normal">
              Whether you are building, buying or selling, start here. A member of
              our team will reply within one working day.
            </p>

            <div className="mt-12 border-t border-[rgba(216,180,121,0.25)] pt-8 space-y-6">
              <div>
                <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#b58c49] font-bold block">
                  Telephone
                </span>
                <p className="u-display text-2xl text-[#11141b] font-medium font-serif mt-1">
                  {CONTACT.phone}
                </p>
                <span className="text-xs sm:text-sm text-[#4b5563] font-semibold block mt-0.5">
                  {CONTACT.hours}
                </span>
              </div>
              <div>
                <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#b58c49] font-bold block">
                  Direct Inquiries
                </span>
                <p className="text-base font-mono text-[#11141b] mt-1 font-semibold">
 {CONTACT.email}
                </p>
              </div>
            </div>
          </div>

          {/* Right: enquiry form, or the confirmation once sent */}
          <div className="col-span-full lg:col-span-7">
            {sent ? (
              <div className="inq-card u-panel-soft bg-white p-8 sm:p-12" data-active="true">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rotate-45 bg-[#D8B479] shadow-[0_0_8px_#D8B479]" />
                  <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#b58c49] font-bold">
                    Enquiry Received
                  </span>
                </div>

                <h3 className="u-display text-3xl sm:text-4xl mt-4 text-[#11141b] font-light font-serif">
                  Thank you{formData.name ? `, ${formData.name}` :""}.
                </h3>

                <p className="mt-4 text-base sm:text-lg text-[#1f2937] leading-relaxed font-normal">
                  Your enquiry has reached our team. We will be in touch by your
                  preferred method within one working day.
                </p>

                <div className="mt-8 border-y border-[rgba(216,180,121,0.25)] py-6 space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-[#4b5563] font-medium">Enquiry</span>
                    <span className="font-semibold text-[#11141b]">{viewingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4b5563] font-medium">Contact by</span>
                    <span className="font-semibold text-[#11141b]">{timeSlot}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
 type="button"
 onClick={() => setSent(false)}
 className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-[#b58c49] hover:underline"
                  >
                    ← Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="inq-card bg-white p-6 sm:p-10 lg:p-12 shadow-[0_1px_0_rgba(20,33,61,0.05),0_24px_60px_-30px_rgba(20,33,61,0.28)] space-y-8">
                {/* Enquiry type */}
                <div>
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#11141b] block mb-3.5">
                    What is your enquiry about?
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {ENQUIRY_TYPES.map(({ label: type }) => (
                      <button
 key={type}
 type="button"
 onClick={() => setViewingType(type)}
 data-active={viewingType === type}
 className={[
"u-chip p-3.5 text-left text-xs tracking-wider uppercase font-semibold leading-snug cursor-pointer",
 viewingType === type
                            ?"text-[#11141b]"
                            :"text-[#4b5563]",
                        ].join(" ")}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact preference */}
                <div>
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#11141b] block mb-3.5">
                    How should we reach you?
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {CONTACT_PREFS.map((slot) => (
                      <button
 key={slot}
 type="button"
 onClick={() => setTimeSlot(slot)}
 data-active={timeSlot === slot}
 className={[
"u-chip p-3.5 text-left text-xs tracking-wider uppercase font-semibold leading-snug cursor-pointer",
 timeSlot === slot
                            ?"text-[#11141b]"
                            :"text-[#4b5563]",
                        ].join(" ")}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Inputs */}
                <div className="grid gap-8 sm:grid-cols-2 pt-2">
                  <div>
                    <label htmlFor="name" className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#11141b] block">
                      Full Name *
                    </label>
                    <input
 id="name"
 name="name"
 type="text"
 required
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 placeholder="Your full name"
 className="mt-2 w-full border-0 border-b-2 border-[rgba(216,180,121,0.35)] bg-transparent pb-3 text-base sm:text-lg text-[#11141b] placeholder:text-[#6b7280] outline-none transition-colors duration-300 focus:border-[#b58c49]"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#11141b] block">
                      Email *
                    </label>
                    <input
 id="email"
 name="email"
 type="email"
 required
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 placeholder="name@email.com"
 className="mt-2 w-full border-0 border-b-2 border-[rgba(216,180,121,0.35)] bg-transparent pb-3 text-base sm:text-lg text-[#11141b] placeholder:text-[#6b7280] outline-none transition-colors duration-300 focus:border-[#b58c49]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#11141b] block">
                    Phone / WhatsApp
                  </label>
                  <input
 id="phone"
 name="phone"
 type="tel"
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 placeholder="+92 3XX XXXXXXX"
 className="mt-2 w-full border-0 border-b-2 border-[rgba(216,180,121,0.35)] bg-transparent pb-3 text-base sm:text-lg text-[#11141b] placeholder:text-[#6b7280] outline-none transition-colors duration-300 focus:border-[#b58c49]"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#11141b] block">
                    Your message
                  </label>
                  <textarea
 id="message"
 name="message"
 rows={3}
 value={formData.message}
 onChange={(e) => setFormData({ ...formData, message: e.target.value })}
 placeholder="Plot size and location, what you want to build, your timeline…"
 className="mt-2 w-full resize-none border-0 border-b-2 border-[rgba(216,180,121,0.35)] bg-transparent pb-3 text-base sm:text-lg text-[#11141b] placeholder:text-[#6b7280] outline-none transition-colors duration-300 focus:border-[#b58c49]"
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-[rgba(216,180,121,0.25)]">
                  <button
 type="submit"
 className="cursor-pointer bg-[#D8B479] hover:bg-[#b58c49] text-[#11141b] hover:text-white px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] shadow-md transition-all flex items-center justify-center gap-3 self-start sm:self-auto"
                  >
                    <span>Send enquiry</span>
                    <span>→</span>
                  </button>
                  <span className="text-xs sm:text-sm text-[#4b5563] tracking-wider uppercase font-semibold">
                    We reply within one working day
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
