// server.js
const express = require("express");
const http = require("http");
const https = require("https");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

const httpsOptions = {
  key: fs.readFileSync("./certificates/private.key"),
  cert: fs.readFileSync("./certificates/certificate.crt"),
  ca: fs.readFileSync("./certificates/ca_bundle.crt"),
};

app.prepare().then(() => {
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // server.get("*", (request, response) => {
  //   response.redirect(`https://${request.headers.host}${request.url}`);
  // });

  if (process.env.NODE_ENV === "development") {
    // 개발환경일 경우 http, 3000포트로 실행
    http.createServer(server).listen(3000);
  } else {
    // 배포환경일 경우 http 와 https 모두 열어둔 후 http 로 접속할 경우 https 로 리다이렉트
    http.createServer(server).listen(80);
    https.createServer(httpsOptions, server).listen(443);
    // server.use((req1, res1, tonext) => {
    //   if (req1.secure) {
    //     // request was via https, so do no special handling
    //     tonext();
    //   } else {
    //     // request was via http, so redirect to https
    //     res1.redirect(`https://${req.headers.host}${req.url}`);
    //   }
    // });
  }
});
