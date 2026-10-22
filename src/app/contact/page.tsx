import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import RevealScope from "@/components/ui/RevealScope";
import Inquiry from "@/components/sections/Inquiry";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { CONTACT, OFFICES, SOCIAL, directionsUrl, mapEmbedUrl } from "@/lib/site";
import SocialIcon from "@/components/ui/SocialIcon";
import { INTERIORS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact JC Landmarks about a commercial or residential project, buying or selling a home, or visiting an ongoing site.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <ScrollProgress />
      <main id="top">
        <PageHero
          eyebrow="Contact"
          title="Let’s talk about"
          accent="your project."
          lede="Building, buying or selling — tell us what you have in mind and the right person on our team will reply within one working day."
          crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          still={INTERIORS.foyerGallery}
        >
          {/* Direct lines, for people who would rather not fill in a form */}
          <div className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
            {[
              { label: "Call", value: CONTACT.phone, href: CONTACT.phoneHref },
              { label: "WhatsApp", value: CONTACT.whatsapp, href: CONTACT.whatsappHref },
              { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
            ].map((c) => (
              <a key={c.label} href={c.href} className="group block">
                <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-[rgba(244,242,238,0.44)]">{c.label}</span>
                <span className="mt-2 block font-serif text-[1.15rem] font-light text-[#f4f2ee] transition-colors group-hover:text-[#D8B479]">
                  {c.value}
                </span>
              </a>
            ))}
          </div>
        </PageHero>

        <Inquiry />

        {/* Offices + map */}
        <RevealScope as="section" id="offices" className="bg-[#ffffff] py-[clamp(6rem,14vh,10rem)] text-[#11141b]">
          <div className="u-shell">
            <span data-r="up" className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b58c49]">
              Office Locations
            </span>
            <h2 data-r="words" className="mt-8 max-w-2xl font-serif text-[clamp(1.9rem,3.8vw,3.2rem)] font-light leading-[1.16] tracking-[-0.01em]">
              Visit us, by appointment.
            </h2>

            {OFFICES.map((o) => (
              <div key={o.name} className="mt-[clamp(3.5rem,8vh,5rem)] grid gap-y-12 lg:grid-cols-12 lg:gap-x-20">
                <div className="col-span-full lg:col-span-4">
                  <span data-r="rule" aria-hidden="true" className="block h-px origin-left bg-[rgba(20,33,61,0.12)]" />
                  <div data-r="stagger" className="pt-8">
                    <h3 className="font-serif text-[clamp(1.4rem,2.1vw,1.8rem)] font-light">{o.name}</h3>
                    <address className="mt-5 not-italic text-[0.98rem] leading-[1.8] text-[#4b5563]">
                      {o.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </address>
                    <dl className="mt-8 space-y-5">
                      <div>
                        <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-[#8a8f9a]">Hours</dt>
                        <dd className="mt-1.5 text-[0.95rem]">{CONTACT.hours}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-[#8a8f9a]">Telephone</dt>
                        <dd className="mt-1.5 text-[0.95rem]">
                          <a href={CONTACT.phoneHref} className="transition-colors hover:text-[#b58c49]">{CONTACT.phone}</a>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-[#8a8f9a]">Email</dt>
                        <dd className="mt-1.5 text-[0.95rem]">
                          <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-[#b58c49]">{CONTACT.email}</a>
                        </dd>
                      </div>
                    </dl>
                    <a
                      href={directionsUrl(o)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-9 inline-flex items-center gap-3 text-[0.64rem] uppercase tracking-[0.24em] transition-colors hover:text-[#b58c49]"
                    >
                      Get directions
                      <span aria-hidden="true" className="text-[#b58c49] transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                    </a>

                    {/* Social */}
                    <div className="mt-10">
                      <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-[#8a8f9a]">Follow</span>
                      <ul className="mt-4 flex gap-3">
                        {SOCIAL.map((s) => (
                          <li key={s.href}>
                            <a
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`JC Landmarks on ${s.label}`}
                              className="grid h-11 w-11 place-items-center bg-[#f5f6f8] text-[#11141b] transition-colors duration-300 hover:bg-[#11141b] hover:text-[#D8B479]"
                            >
                              <SocialIcon name={s.icon} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div data-r="plate" className="relative col-span-full aspect-[16/11] overflow-hidden bg-[#eceef1] lg:col-span-8">
                  <iframe
                    title={`Map showing ${o.name}`}
                    src={mapEmbedUrl(o)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0 grayscale-[85%] contrast-[1.05]"
                  />
                </div>
              </div>
            ))}
          </div>
        </RevealScope>
      </main>
      <Footer />
    </>
  );
}
