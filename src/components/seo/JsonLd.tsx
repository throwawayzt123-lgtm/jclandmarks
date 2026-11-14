/**
 * Renders schema.org structured data as a JSON-LD script tag.
 *
 * `<` is escaped so no string in the data can close the script element early
 * (the sanitising step the Next.js JSON-LD guide recommends).
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
