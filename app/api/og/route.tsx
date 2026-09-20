import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const publicDir = path.join(process.cwd(), "public");

const titleStyle = {
  position: "absolute" as const,
  bottom: -48,
  left: 0,
  paddingLeft: 88,
  width: "100%",
  color: "white",
  fontSize: 60,
  lineHeight: 1.2,
  maxWidth: 896,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get the query parameters
    const title = searchParams.get("title") || "Blog Post";
    const imageName = searchParams.get("image") || "";

    // Read the blog image
    let blogImageSrc = "";
    if (imageName) {
      const blogImagePath = path.join(publicDir, "blog", imageName);
      if (fs.existsSync(blogImagePath)) {
        // react-doctor-disable-next-line react-doctor/server-hoist-static-io
        const blogImageBuffer = fs.readFileSync(blogImagePath);
        const ext = path.extname(imageName).toLowerCase().slice(1);
        const mimeType = ext === "jpg" ? "jpeg" : ext;
        blogImageSrc = `data:image/${mimeType};base64,${blogImageBuffer.toString("base64")}`;
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            textAlign: "left",
            position: "relative",
          }}
        >
          {blogImageSrc && (
            // ImageResponse renders HTML-like elements into an image; next/image is not available here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.4,
              }}
              src={blogImageSrc}
              alt="article background"
            />
          )}

          <h1
            style={titleStyle}
          >
            {title}
          </h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
