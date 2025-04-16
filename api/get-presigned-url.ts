import type { VercelRequest, VercelResponse } from '@vercel/node'; // <-- Added Import
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 🔧 ENV VARS (make sure these are in `.env` for local and Vercel config for prod)
// Consider adding checks here to ensure they exist instead of using '!'
const REGION = process.env.AWS_REGION!;
const BUCKET_NAME = process.env.AWS_S3_BUCKET!;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID!;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY!;

// Add runtime checks for environment variables for safety
if (!REGION || !BUCKET_NAME || !ACCESS_KEY || !SECRET_KEY) {
  console.error("FATAL ERROR: Missing required AWS environment variables!");
  // Throw error during initialization if env vars are critical and missing
  throw new Error("Missing required AWS environment variables!");
  // If you prefer to handle it in the request, move check inside handler and return 500
}

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// Updated function signature with types
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    // Use `setHeader` for consistency if needed, though status sets implicitly
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // VercelRequest often includes parsed body directly
    const { filename } = req.body;

    if (!filename || typeof filename !== 'string' || !filename.endsWith(".md")) {
      return res.status(400).json({ error: "Invalid or missing filename (must be .md string)" });
    }

    // Optional: Basic sanitization/validation for filename if needed
    // const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, ''); // Example only

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `blog-drafts/${filename}`, // Use original or safeFilename
      ContentType: "text/markdown",
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes

    return res.status(200).json({ url: signedUrl });

  } catch (err) {
    // Log the specific error for debugging
    console.error("Error generating presigned URL:", err);

    // Optionally check error type for more specific responses
    // if (err.name === 'SomeAwsError') { ... }

    return res.status(500).json({ error: "Failed to generate upload URL" });
  }
}
