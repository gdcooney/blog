import type { APIRoute } from "astro";
import { generateOgImageForSite } from "src/utils/generateOgImages.ts";

export const GET: APIRoute = async () =>
  new Response(await generateOgImageForSite(), {
    headers: { "Content-Type": "image/png" },
  });
