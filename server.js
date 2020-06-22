// server.js
const http = require("http");
const https = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./certificates/private.key"),
  cert: fs.readFileSync("./certificates/certificate.crt"),
  ca: fs.readFileSync("./certificates/ca_bundle.crt"),
};

let port;

if (process.env.NODE_ENV === "development") {
  port = 3000;
} else {
  port = 443;
}

app.prepare().then(() => {
  if (process.env.NODE_ENV === "development") {
    http
      .createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname === "/a") {
          app.render(req, res, "/a", query);
        } else if (pathname === "/b") {
          app.render(req, res, "/b", query);
        } else {
          handle(req, res, parsedUrl);
        }
      })
      .listen(port, (err) => {
        if (err) throw err;

        console.log(`> Ready on http://localhost:3000`);
      });
  } else {
    https
      .createServer(httpsOptions, (req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname === "/a") {
          app.render(req, res, "/a", query);
        } else if (pathname === "/b") {
          app.render(req, res, "/b", query);
        } else {
          handle(req, res, parsedUrl);
        }
      })
      .listen(port, (err) => {
        if (err) throw err;

        console.log(`> Ready on https://blog.daily-funding.com`);
      });
  }
});
