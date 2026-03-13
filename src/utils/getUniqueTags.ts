import { slugifyAll } from "./slugify.js";

export interface ChroniclePost {
  tags?: string[];
  [key: string]: any;
}

const getUniqueTags = (posts: ChroniclePost[]) => {
  const tags = posts
    .flatMap(post => post.tags || ["others"])
    .map(tag => slugifyAll([tag])[0])
    .filter((value: string, index: number, self: string[]) => 
      self.indexOf(value) === index
    )
    .sort((tagA: string, tagB: string) => tagA.localeCompare(tagB));
  return tags;
};

export default getUniqueTags;
