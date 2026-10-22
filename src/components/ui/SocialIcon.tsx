/**
 * Minimal line icons for the social profiles — inline SVG, no icon library.
 * Decorative: the link around it carries the accessible name.
 */
interface SocialIconProps {
  name: "facebook" | "instagram";
  className?: string;
}

export default function SocialIcon({ name, className = "h-[18px] w-[18px]" }: SocialIconProps) {
  if (name === "facebook") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
