import swal from "sweetalert";

import * as constants from "constants.js";

import Blog from "@Img/blog@2x.png";
import Insta from "@Img/insta@2x.png";
import Brunch from "@Img/brunch@2x.png";

import "./Footer.scss";

class Footer extends React.Component {
  state = {};

  setInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  sendEmail = () => {
    const { newsLetterMail } = this.state;

    if (newsLetterMail) {
      const formData = new FormData();
      formData.append("action", "tail_news");
      formData.append("email", this.state.newsLetterMail);

      fetch(`${constants.URL_NEWS}/ajax/tail_news_ajax.php`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          if (data === "SUCCESS") {
            swal({
              text: "데일리레터 구독 신청이 완료되었습니다.",
              button: "확인",
            }).then(() =>
              this.setState({
                newsLetterMail: "",
              }),
            );
          } else if (data === "errorPost" || data === "errorPath") {
            swal({
              text: "잘못된 접근입니다.",
              button: "확인",
            });
          } else if (data === "errorEmail ") {
            swal({
              text: "이메일을 입력해주세요.",
              button: "확인",
            });
          } else if (data === "errorRow") {
            swal({
              text: "이미 등록된 메일주소입니다.",
              button: "확인",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      swal({
        text: "이메일을 입력해주세요.",
        button: "확인",
      });
    }
  };

  render() {
    const { newsLetterMail } = this.state;

    return (
      <footer className="footer_wrapper">
        <div className="icon_div">
          <a href="https://blog.naver.com/daily-funding" target="_blank">
            <img alt="데일리펀딩 네이버 블로그" src={Blog} />
          </a>
          <a href="https://www.instagram.com/dailyfunding/" target="_blank">
            <img alt="데일리펀딩 인스타그램" src={Insta} />
          </a>
          <a href="https://brunch.co.kr/@dailian#articles" target="_blank">
            <img alt="데일리펀딩 브런치" src={Brunch} />
          </a>
        </div>
        <div className="subscribe_div">
          <p>이 모든 정보를 한 번에 볼 수 있는 </p>
          <em>데일리레터 구독신청</em>
          <div className="input_div">
            <input
              name="newsLetterMail"
              type="text"
              placeholder="example@yourmail.com"
              onChange={this.setInput}
              value={newsLetterMail || ""}
            />
            <button onClick={this.sendEmail}>신청하기 {">"}</button>
          </div>
        </div>
        <a href="https://www.daily-funding.com/" target="_blank">
          <div className="linkto_funding_div">
            <p>이 모든 걸 경험할 수 있는</p>
            <em>데일리펀딩 바로가기</em>
          </div>
        </a>
        <p className="copyright">
          <span>© 2020 DAILYFUNDING.</span>
          <span>모든 콘텐츠의 저작권은 데일리펀딩에 있습니다.</span>
        </p>
      </footer>
    );
  }
}

export default Footer;
