import { slugifyAll } from "./slugify.js";

export interface ChroniclePost {
  tags?: string[];
  [key: string]: any;
}

const getPostsByTag = (posts: ChroniclePost[], tag: string) =>
  posts.filter(post => 
    slugifyAll(post.tags || ["others"]).includes(tag)
  );

export default getPostsByTag;
