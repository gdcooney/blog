export const SITE = {
  // Removed trailing slash for safer validation
  website: "https://blog.proveitsme.io", 
  author: "Gee",
  profile: "https://blog.proveitsme.io",
  desc: "Get after it!",
  title: "proveItsMe.io",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, 
  showArchives: true,
  showBackButton: true, 
  editPost: {
    enabled: true,
    text: "Edit in Lab",
    // Points back to your Supabase-powered Cockpit
    url: "https://lab.proveitsme.io/?date=", 
  },
  dynamicOgImage: true,
  lang: "en", 
  timezone: "Australia/Melbourne", 
} as const;
