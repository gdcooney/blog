export interface ChroniclePost {
  id: string;
  log_date: string;
  journal_content: string; // The HTML from Tiptap
  mood_score: number;
  is_published: boolean;
  // Add other fields you fetch from Supabase
}
