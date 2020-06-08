import Document, { Head, Main, NextScript } from "next/document";
// import React from "react";

export default class DailyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          {/* Spoqa Han Sans 서체 import */}
          <link
            href="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css"
            rel="stylesheet"
            type="text/css"
          />
          {/* 나눔 Square 서체 import */}
          <link
            href="https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css"
            rel="stylesheet"
            type="text/css"
          />
          {/* 나눔 고딕 서체 import */}
          <link
            href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap"
            rel="stylesheet"
            type="text/css"
          />
          {/* Roboto 서체 import */}
          <link
            href="https://fonts.googleapis.com/css?family=Roboto"
            rel="stylesheet"
            type="text/css"
          />
          {/* Open Sans 서체 import */}
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
            rel="stylesheet"
            type="text/css"
          />
          {/* Noto sans 서체 import */}
          <link
            href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:300,400,500,700,900&display=swap"
            rel="stylesheet"
            type="text/css"
          />
          {/* Noto serif KR 서체 import */}
          {/* <link
            href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300;400;500;600;700;900&display=swap"
            rel="stylesheet"
            type="text/css"
          /> */}
          {/* canada-type-gibson 서체 import */}
          <link
            href="https://use.typekit.net/bat1rdm.css"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <body>
          <div id="root">
            <Main />
            <NextScript />
          </div>
        </body>
      </html>
    );
  }
}
