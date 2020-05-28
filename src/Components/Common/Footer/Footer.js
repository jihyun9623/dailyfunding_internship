import Blog from "@Img/blog@2x.png";
import Insta from "@Img/insta@2x.png";
import Brunch from "@Img/brunch@2x.png";

import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer_wrapper">
      <div className="icon_div">
        <img alt="블로그" src={Blog} />
        <img alt="인스타그램" src={Insta} />
        <img alt="브런치" src={Brunch} />
      </div>
      <div className="subscribe_div">
        <p>이 모든 정보를 한 번에 볼 수 있는 </p>
        <em>데일리레터 구독신청</em>
        <div className="input_div">
          <input type="text" placeholder="example@yourmail.com" />
          <button>신청하기 {">"}</button>
        </div>
      </div>
      <div className="linkto_funding_div">
        <p>이 모든 걸 경험할 수 있는</p>
        <em>데일리펀딩 바로가기</em>
      </div>
      <p className="copyright">
        <span>© 2020 DAILYFUNDING.</span>
        <span>모든 콘텐츠의 저작권은 데일리펀딩에 있습니다.</span>
      </p>
    </footer>
  );
}

export default Footer;
