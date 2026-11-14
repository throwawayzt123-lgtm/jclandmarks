import { CONTACT } from "@/lib/site";

/**
 * Floating "chat on WhatsApp" button, bottom-right on every page.
 *
 * Round and in WhatsApp green on purpose — it is the one control people
 * recognise at a glance, so it keeps the shape they know. It sits under the
 * mobile menu (z-99), the loading screen and the panorama viewer, so it never
 * covers them, and clears the iPhone home bar.
 */
const GREETING = "Hello Jay-Cee Landmarks, I would like to know more about ";
const href = `${CONTACT.whatsappHref}?text=${encodeURIComponent(GREETING)}`;

export default function WhatsAppButton() {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed z-[90] flex items-center gap-3 [bottom:max(1.25rem,env(safe-area-inset-bottom))] [right:max(1.25rem,env(safe-area-inset-right))] sm:[bottom:1.75rem] sm:[right:1.75rem]"
    >
      {/* Label slides out on hover — desktop only */}
      <span className="pointer-events-none hidden translate-x-2 bg-[#000000] px-4 py-2.5 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#f4f2ee] opacity-0 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 lg:block">
        Chat on WhatsApp
      </span>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_32px_-10px_rgba(18,140,74,0.65)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[#25D366]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </span>
    </a>
  );
}
