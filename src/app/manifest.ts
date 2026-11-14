import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

/** Lets phones save the site to the home screen with the right name, icon and colours. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Jay-Cee",
    description: "Design-and-build construction company in Lahore. Ordinary is not our address.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
