import Link from "next/link";
// import Router from "next/router";

import AliceCarousel from "react-alice-carousel";

import Footer from "Components/Common/Footer/Footer";

import Logo from "@Img/big_logo_white.png";
import CircleArrow from "@Img/circle_right.png";
import CarouselLeft from "@Img/carousel_left@2x.png";
import CarouselRight from "@Img/carousel_right@2x.png";
import DownArrow from "@Img/down.png";

import "./main.scss";

const categoryList = [
  {
    category_id: undefined,
    category_name: "전체보기",
  },
  {
    category_id: 1,
    category_name: "기획 아카이브",
  },
  {
    category_id: 2,
    category_name: "데일리 소식",
  },
  {
    category_id: 3,
    category_name: "데일리언의 수다",
  },
  {
    category_id: 4,
    category_name: "투자자 인터뷰",
  },
  {
    category_id: 5,
    category_name: "데일리 룩",
  },
];

const sampleData1 = [
  {
    id: 1,
    category: "기획 아카이브",
    title: "크라우드펀딩이 하고 싶은 당신에게 말합니다",
    subtitle: "by 데일리언 정창언",
    date: "2020년 2월 21일",
    description:
      "제가 전공했던 농업경제학은 농산업과 관련된 다양한 분야를 다루는데, 그중에 제일 기초는 경제학이었어요. 게다가 당시는 금융산업이 워낙 주목받던 시기였죠. 카드 사태 이후 국내 경기가 회복되던 와중에 서브프라임 모기지 사태로 촉발된 글로벌 금융위기가 발생했는데, 저 역시 시장의 변동폭도 매우 컸고 언론과 책을",
  },
  {
    id: 2,
    category: "기획 아카이브",
    title: "게임과 투자의 공통점은 이길 확률이 높은 쪽에 배팅하는거죠",
    subtitle: "by 20대 프로게이머, 진현성님",
    date: "2020년 2월 22일",
    description:
      "제가 전공했던 농업경제학은 농산업과 관련된 다양한 분야를 다루는데, 그중에 제일 기초는 경제학이었어요. 게다가 당시는 금융산업이 워낙 주목받던 시기였죠. 카드 사태 이후 국내 경기가 회복되던 와중에 서브프라임 모기지 사태로 촉발된 글로벌 금융위기가 발생했는데, 저 역시 시장의 변동폭도 매우 컸고 언론과 책을",
  },
];

class Main extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  // article title 이 몇 줄인지 세는 함수
  // countLines = (id) => {
  //   const el = document.getElementById(`content${id}`);
  //   const divHeight = el.offsetHeight;
  //   const lineHeight = parseInt(el.style.lineHeight);
  //   const lines = divHeight / lineHeight;

  //   return lines;
  // };

  render() {
    const { selectedCategory } = this.state;

    return (
      <div className="dailyblog_main_wrapper">
        <header className="top_div">
          <img alt="데일리 인사이트" src={Logo} />
          <a href="https://www.daily-funding.com/">
            <p>
              <span>데일리펀딩 바로가기</span>
              <img alt="바로가기" src={CircleArrow} />
            </p>
          </a>
        </header>

        <section className="carousel_wrap">
          <AliceCarousel
            buttonsDisabled
            duration={500}
            ref={(el) => (this.Carousel = el)}
          >
            {sampleData1.map((el, idx) => (
              <div key={idx} className="carousel_item">
                <div className="carousel_cover">
                  <Link href={`/post?id=${el.id}`}>
                    <div className="center_div">
                      <p className="category_badge">{el.category}</p>
                      <p className="title">{el.title}</p>
                      <p className="subtitle">{el.subtitle}</p>
                    </div>
                  </Link>
                  <div className="bottom_div">{el.date}</div>
                </div>
              </div>
            ))}
          </AliceCarousel>
          <button
            className="carousel_left_btn"
            onClick={() => this.Carousel.slidePrev()}
          >
            <img alt="왼쪽으로" src={CarouselLeft} />
          </button>
          <button
            className="carousel_right_btn"
            onClick={() => this.Carousel.slideNext()}
          >
            <img alt="오른쪽으로" src={CarouselRight} />
          </button>
        </section>

        <section className="articles_list_wrap">
          <div className="category_div">
            {categoryList.map((el, idx) => (
              <div
                key={idx}
                className={`category_badge ${
                  el.category_id === selectedCategory ? "active" : ""
                }`}
              >
                {el.category_name}
              </div>
            ))}
          </div>

          <div className="articles_list_div">
            {sampleData1.map((el, idx) => (
              <div key={idx} className="article_item">
                <Link href={`/post?id=${el.id}`}>
                  <div className="picture_div" />
                </Link>
                <div className="info_div">
                  <div className="category_badge">{el.category}</div>
                  <Link href={`/post?id=${el.id}`}>
                    <p id={`content${el.id}`} className="title">
                      {el.title}
                    </p>
                  </Link>
                  <p className="description">{el.description}</p>
                  <Link href={`/post?id=${el.id}`}>
                    <p className="item_more_btn">MORE {">"}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="more_btn_div">
            <p>MORE</p>
            <img alt="더보기" src={DownArrow} />
          </div>
        </section>

        <Footer />
      </div>
    );
  }
}

export default Main;
