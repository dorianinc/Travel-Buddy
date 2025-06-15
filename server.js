const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Load templates
const layoutTemplate = handlebars.compile(
  fs.readFileSync("./views/layouts/layout.hbs", "utf8")
);
const homeTemplate = handlebars.compile(
  fs.readFileSync("./views/home.hbs", "utf8")
);

const serveStaticFile = (res, filepath, contentType) => {
  fs.readFile(filepath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("File not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
};

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    const content = homeTemplate({ name: "Dorian" });
    const fullHtml = layoutTemplate({ title: "Home Page", body: content });
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fullHtml);
  } else if (req.url === "/style.css") {
    const cssPath = path.join(__dirname, "public", "css", "style.css");
    fs.readFile(cssPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("CSS not found");
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      }
    });
  } else if (req.url.startsWith("/images/")) {
    const imagePath = path.join(__dirname, "public", req.url);
    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };
    serveStaticFile(
      res,
      imagePath,
      mimeTypes[ext] || "application/octet-stream"
    );
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
