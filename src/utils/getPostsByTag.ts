import type { CollectionEntry } from "astro:content";
import getSortedPosts from "src/utils/getSortedPosts.ts";
import { slugifyAll } from "src/utils/slugify.ts";

const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
  );

export default getPostsByTag;
