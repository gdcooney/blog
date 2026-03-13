// Define a simplified interface that matches your Supabase log structure
export interface ChroniclePost {
  id: string;
  log_date: string;
  journal_content: string;
  mood_score: number;
  is_published: boolean;
  title?: string;
  description?: string;
}

const getSortedPosts = (posts: ChroniclePost[]) => {
  return posts
    .filter(post => post.is_published) // Filter out unpublished drafts
    .sort(
      (a, b) =>
        Math.floor(new Date(b.log_date).getTime() / 1000) -
        Math.floor(new Date(a.log_date).getTime() / 1000)
    );
};

export default getSortedPosts;
