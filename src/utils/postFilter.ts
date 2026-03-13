import { SITE } from "src/config.ts";

/**
 * Define a local interface that matches your Supabase log structure
 * to replace the broken CollectionEntry type.
 */
export interface ChroniclePost {
  log_date: string;
  is_published: boolean;
}

/**
 * Filters posts based on their published status and scheduled time.
 * Logic:
 * 1. Must have is_published set to true.
 * 2. If it's a future date, it only shows if the margin has passed (or in Dev mode).
 */
const postFilter = (post: ChroniclePost) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(post.log_date).getTime() - SITE.scheduledPostMargin;

  return post.is_published && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
