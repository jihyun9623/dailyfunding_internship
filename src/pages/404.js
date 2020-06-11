import Head from "next/head";

import HolyIcon from "@Img/holy_icon.jpg";
import "./custom404.scss";

export default function Custom404() {
  return (
    <div className="custom_404_wrapper">
      <Head>
        <title>데일리 인사이트 :: 페이지를 찾을 수 없습니다.</title>
        <meta id="og-type" property="og:type" content="website" />
        <meta
          id="og-title"
          property="og:title"
          content="데일리 인사이트 :: 페이지를 찾을 수 없습니다."
        />
        <meta property="og:description" content="페이지를 찾을 수 없습니다." />
        <meta property="og:image" content="Img/sns_logo.png" />
      </Head>
      <img alt="404 숫자를 들고 있는 홀리 이모티콘" src={HolyIcon} />
      <h1>
        죄송합니다.
        <br />
        원하시는 페이지를 찾을 수 없습니다.
      </h1>
      <h3>WE CANNOT FIND YOUR DESTINATION.</h3>
    </div>
  );
}
