const http = require("http");

const port = process.env.PORT || 8080;
const appName = process.env.CONTAINER_APP_NAME || "unknown";

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const server = http.createServer((req, res) => {
  const path = req.url.split("?")[0];
  if (path === "/health" || path === "/healthz") {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" });
      return res.end();
    }
    const body = JSON.stringify({ status: "ok", app: appName });
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
      "Cache-Control": "no-store",
    });
    // HEAD gets the same headers as GET but no body
    return res.end(req.method === "HEAD" ? undefined : body);
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!DOCTYPE html>
<html>
  <head><title>${escapeHtml(appName)}</title></head>
  <body><h1>This app is running on ${escapeHtml(appName)}</h1></body>
</html>`);
});

server.listen(port, () => console.log(`Listening on port ${port} as ${appName}`));

process.on("SIGTERM", () => server.close(() => process.exit(0)));
