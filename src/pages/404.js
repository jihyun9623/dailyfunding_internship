import HolyIcon from "@Img/holy_icon.jpg";
import "./custom404.scss";

export default function Custom404() {
  return (
    <div className="custom_404_wrapper">
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
