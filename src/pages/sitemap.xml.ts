import type { APIRoute } from "astro";
import { supabaseServer } from "@/lib/supabase-server.js";

const BASE = "https://blog.proveitsme.io";

export const GET: APIRoute = async () => {
  // Fetch all public profiles — must use service role key, anon key returns nothing due to RLS
  const { data: profiles } = await supabaseServer
    .from("ms_profiles")
    .select("id, username, updated_at")
    .eq("blog_enabled", true);

  const urls: string[] = [];

  for (const profile of profiles ?? []) {
    const profileUrl = `${BASE}/${profile.username}`;
    const profileMod = (profile.updated_at ?? "").slice(0, 10);

    urls.push(`
  <url>
    <loc>${profileUrl}</loc>
    ${profileMod ? `<lastmod>${profileMod}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
  </url>`);

    // Fetch published entries for this profile
    const { data: entries } = await supabaseServer
      .from("ms_daily_logs")
      .select("log_date, updated_at")
      .eq("is_published", true)
      .eq("user_id", profile.id)
      .order("log_date", { ascending: false });

    for (const entry of entries ?? []) {
      const lastmod = (entry.updated_at ?? entry.log_date ?? "").slice(0, 10);
      urls.push(`
  <url>
    <loc>${BASE}/${profile.username}/${entry.log_date}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>never</changefreq>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
