const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const { url } = require("inspector");

// Load templates
const baseTemplate = handlebars.compile(
  fs.readFileSync("./views/base.hbs", "utf8")
);
const homeTemplate = handlebars.compile(
  fs.readFileSync("./views/layouts/home.hbs", "utf8")
);
const planTemplate = handlebars.compile(
  fs.readFileSync("./views/layouts/plan.hbs", "utf8")
);
const itineraryTemplate = handlebars.compile(
  fs.readFileSync("./views/layouts/itinerary.hbs", "utf8")
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
  const urlPath = req.url;
  const ext = path.extname(urlPath).toLowerCase();

  switch (true) {
    case urlPath === "/": {
      const content = homeTemplate({ name: "Dorian" });
      const fullHtml = baseTemplate({ title: "Home Page", body: content });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fullHtml);
      break;
    }

    case urlPath === "/plan": {
      console.log("planning page");
      const content = planTemplate();
      const fullHtml = baseTemplate({ title: "Home Page", body: content });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fullHtml);
      break;
    }

    case urlPath === "/itinerary": {
      console.log("itinerary page");
      const content = itineraryTemplate();
      const fullHtml = baseTemplate({ title: "Home Page", body: content });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fullHtml);
      break;
    }

    case urlPath === "/style.css": {
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
      break;
    }

    case urlPath.startsWith("/images/"): {
      const imagePath = path.join(__dirname, "public", urlPath);
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
      break;
    }

    default: {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Page not found");
      break;
    }
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
