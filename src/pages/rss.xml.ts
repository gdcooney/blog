import rss from "@astrojs/rss";
import { SITE } from "src/config.ts";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for the build step
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  // 1. Fetch published logs directly from Supabase
  const { data: posts, error } = await supabase
    .from('ms_daily_logs')
    .select('*')
    .eq('is_published', true)
    .order('log_date', { ascending: false });

  if (error || !posts) {
    console.error("RSS Feed Error:", error);
    return new Response("Error fetching posts", { status: 500 });
  }

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: posts.map((post) => ({
      // 2. Map Supabase fields to RSS standard fields
      link: `blog/${post.log_date}`,
      title: post.title || `Entry: ${post.log_date}`,
      // Strip HTML tags from journal_content for the RSS description
      description: post.description || post.journal_content.replace(/<[^>]*>?/gm, '').substring(0, 160) + "...",
      pubDate: new Date(post.log_date),
    })),
  });
}
