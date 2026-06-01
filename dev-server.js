import { createReadStream, statSync, watch } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, relative, resolve, sep } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 5173);
const clients = new Set();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".wav": "audio/wav",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".wasm": "application/wasm"
};

const reloadClient = `
<script type="module">
  const events = new EventSource("/__hot_reload");
  events.addEventListener("reload", () => location.reload());
  events.addEventListener("error", () => {
    events.close();
    setTimeout(() => location.reload(), 1000);
  });
</script>`;

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const target = resolve(root, normalize(decoded === "/" ? "index.html" : decoded.slice(1)));
  const rel = relative(root, target);

  if (rel.startsWith("..") || rel.includes(`..${sep}`) || rel === "..") {
    return null;
  }

  return target;
}

async function serveFile(request, response) {
  const filePath = safePath(new URL(request.url, `http://${request.headers.host}`).pathname);

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      response.writeHead(302, { Location: "/" });
      response.end();
      return;
    }

    const ext = extname(filePath);

    if (ext === ".html") {
      const html = await readFile(filePath, "utf8");
      response.writeHead(200, { "Content-Type": mimeTypes[ext] });
      response.end(html.includes("</body>") ? html.replace("</body>", `${reloadClient}\n</body>`) : `${html}${reloadClient}`);
      return;
    }

    response.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

function sendReload() {
  for (const client of clients) {
    client.write("event: reload\ndata: change\n\n");
  }
}

const server = createServer((request, response) => {
  if (request.url?.startsWith("/__hot_reload")) {
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream"
    });
    response.write(": connected\n\n");
    clients.add(response);
    request.on("close", () => clients.delete(response));
    return;
  }

  serveFile(request, response);
});

let reloadTimer;

function watchDirectory(directory) {
  try {
    watch(directory, (_eventType, filename) => {
      if (!filename || filename.startsWith(".") || filename.startsWith(".DS_Store")) return;

      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(sendReload, 80);
    });
  } catch (error) {
    console.warn(`Could not watch ${directory}: ${error.message}`);
  }
}

watchDirectory(root);
watchDirectory(join(root, "assets", "BACKGROUND", "fullwidth", "200ppi"));
watchDirectory(join(root, "assets", "BACKGROUND", "fullwidth", "scene"));

server.listen(port, "0.0.0.0", () => {
  console.log(`Hot reload server running at http://localhost:${port}`);
});
