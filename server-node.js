// 해당 코드는 express 를 사용하지 않고 짠 코드입니다.
// http -> https 리다이렉트를 위해서 express 를 사용한 코드가 현재 적용되어 있습니다.
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

app.prepare().then(() => {
  if (process.env.NODE_ENV === "development") {
    http
      .createServer((req, res) => {
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
      .listen(3000, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:3000`);
      });
  } else {
    https
      .createServer(httpsOptions, (req, res) => {
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
      .listen(443, (err) => {
        if (err) throw err;
        console.log(`> Ready on https://blog.daily-funding.com`);
      });
  }
});
