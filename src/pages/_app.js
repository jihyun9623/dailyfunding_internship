import App from "next/app";

// 공통 css
import "Style/_reset.scss";
import "Style/_common.scss";
import "Style/_font.scss";

// 라이브러리 css
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-alice-carousel/lib/alice-carousel.css";

export default class DailyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
