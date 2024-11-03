import { serve } from "bun";
import { join } from "path";

// Define the directory to serve files from
const DIST_DIR = join(import.meta.dir, "dist");

const server = serve({
  port: 3000,
  fetch(req) {
    // Remove query parameters and get the file path
    const urlPath = new URL(req.url).pathname;

    // Default to "index.html" if the root URL is accessed
    const filePath = urlPath === "/" ? "/index.html" : urlPath;

    try {
      return new Response(Bun.file(join(DIST_DIR, filePath)));
    } catch {
      // Return 404 if file is not found
      return new Response("Not found", { status: 404 });
    }
  },
});
console.log("Server running on http://localhost:3000");