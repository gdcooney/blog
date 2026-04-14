import type { APIRoute } from "astro";
import { supabaseServer } from "@/lib/supabase-server.js";

export const prerender = false;

function formatLongDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${day} ${months[month - 1]} ${year}`;
}

function toRFC822(dateStr: string): string {
  return new Date(dateStr + "T00:00:00Z").toUTCString();
}

export const GET: APIRoute = async ({ params }) => {
  const { username } = params;

  const { data: profile } = await supabaseServer
    .from("ms_profiles")
    .select("id, username, display_name, about_me, blog_enabled")
    .ilike("username", username ?? "")
    .single();

  if (!profile || profile.blog_enabled === false) {
    return new Response(null, { status: 404 });
  }

  const { data: logs } = await supabaseServer
    .from("ms_daily_logs")
    .select("log_date, journal_content")
    .eq("user_id", profile.id)
    .eq("is_published", true)
    .order("log_date", { ascending: false })
    .limit(20);

  const base = "https://blog.proveitsme.io";
  const feedUrl = `${base}/${profile.username}`;
  const description = profile.about_me ?? "Personal chronicle on proveItsMe.io";
  const title = `${profile.display_name}'s Chronicle — proveItsMe.io`;

  const items = (logs ?? [])
    .map((log) => {
      const link = `${base}/${profile.username}/${log.log_date}`;
      return `
    <item>
      <title>${formatLongDate(log.log_date)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${toRFC822(log.log_date)}</pubDate>
      <description><![CDATA[${log.journal_content ?? ""}]]></description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${feedUrl}</link>
    <description>${description}</description>
    <atom:link href="${base}/rss/${profile.username}.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
