import { Resvg } from "@resvg/resvg-js";
import postOgImage from "src/utils/og-templates/post.js";
import siteOgImage from "src/utils/og-templates/site.js";

/**
 * Define a custom interface for the OG generator.
 * This matches the data structure coming from your Supabase logs.
 */
export interface ChroniclePost {
  title?: string;
  log_date: string;
  description?: string;
}

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

/**
 * Generates an OG image for a specific Supabase log entry.
 * Note: You may need to verify that 'postOgImage' doesn't 
 * strictly require Astro-specific properties like 'data'.
 */
export async function generateOgImageForPost(post: ChroniclePost) {
  // We pass the simplified post object to the template
  const svg = await postOgImage(post);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await siteOgImage();
  return svgBufferToPngBuffer(svg);
}
