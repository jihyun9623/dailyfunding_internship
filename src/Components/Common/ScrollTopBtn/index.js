import smoothscroll from "smoothscroll-polyfill";

import "./ScrollTopBtn.scss";

class ScrollTopBtn extends React.Component {
  state = {};

  setInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  scrollTop = () => {
    smoothscroll.polyfill();
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  render() {
    return (
      <img
        className="to_top_btn"
        alt="맨 위로 올라가기"
        srcSet="/Img/to_top.png 79w,
        /Img/to_top@2x.png 158w"
        src="/Img/to_top.png"
        onClick={this.scrollTop}
        onKeyDown={this.scrollTop}
      />
    );
  }
}

export default ScrollTopBtn;
