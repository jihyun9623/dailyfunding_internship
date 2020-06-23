import Document, { Head, Main, NextScript } from "next/document";

export default class DailyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          {/* <title>데일리 인사이트</title>
          <meta id="og-type" property="og:type" content="website" />
          <meta id="og-title" property="og:title" content="데일리 인사이트" />
          <meta property="og:description" content="데일리 인사이트" />
          <meta property="og:image" content="Img/sns_logo.png" /> */}
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
