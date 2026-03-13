export interface ChroniclePost {
  [key: string]: any;
}

const getPostsByGroupCondition = <T extends ChroniclePost, K extends string>(
  posts: T[],
  groupFunction: (post: T) => K
) => {
  const result: Record<K, T[]> = {} as Record<K, T[]>;
  posts.forEach(post => {
    const key = groupFunction(post);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(post);
  });
  return result;
};

export default getPostsByGroupCondition;
