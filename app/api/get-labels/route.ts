// app/api/get-labels/route.ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION, // e.g., "us-east-1"
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN!,
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageKey = searchParams.get("key"); // The image key (from upload)

    if (!imageKey) {
      return Response.json(
        { message: "Missing image key" },
        { status: 400 }
      );
    }

    // Derive the output key (e.g., "uploads/myimage.jpg" becomes "uploads/myimage.txt")
    const outputKey = imageKey.replace(/\.[^/.]+$/, ".txt").replace("uploads", "ar_out");

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: outputKey,
    });

    const response = await s3Client.send(command);

    // Retrieve the file contents as a string from the stream
    // Note: transformToString() is a helper available in AWS SDK v3 for Node.js v18+.
    const labels = await response.Body?.transformToString();

    return Response.json({ labels });
  } catch (error: any) {
    // If the object isn't found, you can return a specific message
    // so the client knows the labels aren't ready yet.
    return Response.json(
      { labels: null, message: "Labels not ready" },
      { status: 404 }
    );
  }
}
