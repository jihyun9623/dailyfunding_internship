import Link from "next/link";
import Router, { withRouter } from "next/router";
import Head from "next/head";

import AliceCarousel from "react-alice-carousel";
import * as moment from "moment";
import "moment-timezone";

import MainLayout from "Components/Common/Layout/MainLayout/MainLayout";
import Footer from "Components/Common/Footer/Footer";
import { getFetch } from "Utils/GetFetch";
import { queryToObject, objectToQuerystring } from "Utils/QueryString";
import * as constants from "constants.js";

import Logo from "@Img/big_logo_white.png";
import CircleArrow from "@Img/circle_right.png";
import CarouselLeft from "@Img/carousel_left@2x.png";
import CarouselRight from "@Img/carousel_right@2x.png";
import DownArrow from "@Img/down.png";

import "./main.scss";

class Main extends React.Component {
  // getServerSideProps 로 변경 예정
  static async getInitialProps() {
    // 포스트 정보 prefetch
    let res;

    await fetch(`${constants.URL_BACK}/posts/list/main`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.post_list) {
          res = response.post_list;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    if (res && res.length !== 0) {
      // 메인 포스트가 존재할 때는 page Head 에 첫 포스트 정보 삽입
      return {
        mainPostList: res,
        mainPostTitle: res[0].title,
        mainPostDescription: res[0].description,
        mainPostGuid: res[0].main_image_guid,
      };
    } else {
      // 메인 포스트가 존재하지 않을 때는 '데일리 인사이트' 타이틀과 로고 이미지 삽입
      return {
        mainPostList: [],
        mainPostTitle: "데일리 인사이트",
        mainPostDescription: "",
        mainPostGuid: undefined,
      };
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      isAdmin: false,
      windowSize: 0,
      categoryId: Number(queryToObject(props.router.asPath).category_id) || "",
      categoryList: [],
      postList: [],
      pageNum: 1,
    };

    this.scrollDiv = React.createRef();
  }

  componentDidMount = () => {
    // 카테고리 리스트
    getFetch(
      "/categories/posts/list",
      { token: "any" },
      this.getCategoryListRes,
    );

    // 상단 노출 포스트 리스트
    // this.getMainPostList();

    // 포스트 리스트
    this.getPostList();

    window.addEventListener("resize", this.handleWindowResize);

    this.setState({
      windowSize: window.innerWidth,
    });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      windowSize: window.innerWidth,
    });
  };

  // 관리자 세팅 (MainLayout으로부터 관리자 여부 받아옴)
  setIsAdmin = (isAdmin) => {
    this.setState({
      isAdmin,
    });
  };

  getCategoryListRes = (res) => {
    if (res.category_list) {
      this.setState({
        categoryList: res.category_list,
      });
    }
  };

  // 포스트 리스트
  getPostList = (reset) => {
    const { pageNum, categoryId } = this.state;

    const params = {};
    params.page_num = pageNum;
    categoryId && (params.category_id = categoryId);

    getFetch(
      `/posts/list${objectToQuerystring(params)}`,
      { token: "any" },
      (res) => this.getPostListRes(res, reset),
    );
  };

  getPostListRes = (res, reset) => {
    if (res.post_list) {
      let arr1;
      let arr2;

      if (reset) {
        // 지금과 다른 카테고리를 선택했을 때
        arr2 = res.post_list;
      } else {
        arr1 = [...this.state.postList];
        arr2 = arr1.concat(res.post_list);
      }

      this.setState(
        {
          postList: arr2,
          totalCount: res.total_count,
        },
        () => {
          const { totalCount, pageNum } = this.state;

          if (totalCount - 6 * pageNum > 0) {
            this.setState({
              moreBtnStatus: true,
            });
          } else {
            this.setState({
              moreBtnStatus: false,
            });
          }
        },
      );
    }
  };

  // 카테고리 선택
  selectCategory = (id) => {
    this.setState(
      {
        categoryId: id,
        pageNum: 1,
      },
      () => {
        const { windowSize } = this.state;
        let scrollHeight;
        windowSize > 768 && (scrollHeight = 814);
        windowSize <= 768 && (scrollHeight = 580);
        windowSize <= 414 && (scrollHeight = 427);

        // shallow routing 을 이용해 쿼리스트링 변경해주기
        if (this.state.categoryId) {
          // id 가 있을 경우 해당 카테고리로 이동
          Router.push(`/?category_id=${id}`, undefined, {
            shallow: true,
          }).then(() => this.getPostList("reset"));

          window.scrollTo({ top: scrollHeight, behavior: "smooth" });
        } else {
          // id 가 없을 경우 전체보기로 이동
          Router.push("/").then(() => this.getPostList("reset"));

          window.scrollTo({ top: scrollHeight, behavior: "smooth" });
        }
      },
    );
  };

  // 'more' 버튼 (더보기 기능)
  addPage = () => {
    this.setState(
      (prevState) => ({
        pageNum: prevState.pageNum + 1,
      }),
      () => this.getPostList(),
    );
  };

  // article title 이 몇 줄인지 세는 함수
  // countLines = (id) => {
  //   const el = document.getElementById(`content${id}`);
  //   const divHeight = el.offsetHeight;
  //   const lineHeight = parseInt(el.style.lineHeight);
  //   const lines = divHeight / lineHeight;

  //   return lines;
  // };

  render() {
    const {
      mainPostList,
      mainPostTitle,
      mainPostDescription,
      mainPostGuid,
    } = this.props;

    const {
      windowSize,
      isAdmin,
      categoryList,
      categoryId,
      postList,
      moreBtnStatus,
    } = this.state;

    return (
      <MainLayout setIsAdmin={this.setIsAdmin} refreshData={this.getPostList}>
        <div className="dailyblog_main_wrapper">
          {/* dynamic meta tag */}
          {/* 메인 포스트의 첫 포스트가 기준이 됩니다. */}
          <Head>
            <title>{mainPostTitle}</title>
            <meta id="og-type" property="og:type" content="website" />
            <meta id="og-title" property="og:title" content={mainPostTitle} />
            <meta property="og:description" content={mainPostDescription} />
            <meta
              property="og:image"
              content={
                mainPostGuid
                  ? `${constants.URL_BACK}/files?guid=${mainPostGuid}`
                  : "Img/sns_logo.png"
              }
            />
          </Head>

          <header className="top_div">
            <img alt="데일리 인사이트 - 데일리펀딩 블로그" src={Logo} />
            <div>
              <a
                href="https://www.daily-funding.com/"
                target="_blank"
                rel="noreferrer"
              >
                <p className="link_to_dailyfunding">
                  <span>데일리펀딩 바로가기</span>
                  <img alt="바로가기" src={CircleArrow} />
                </p>
              </a>
              {isAdmin && (
                <Link href="/admin/post">
                  <button className="link_to_admin">관리자</button>
                </Link>
              )}
            </div>
          </header>

          <section className="carousel_wrap">
            {mainPostList && mainPostList.length > 0 && windowSize !== 0 && (
              <AliceCarousel
                buttonsDisabled
                duration={500}
                ref={(el) => (this.Carousel = el)}
              >
                {mainPostList.map((el, idx) => {
                  return (
                    <div
                      key={idx}
                      className="carousel_item"
                      style={{
                        backgroundImage:
                          windowSize <= 768
                            ? windowSize <= 414
                              ? `url(${constants.URL_BACK}/files?guid=${el.main_image_guid}&width=550)`
                              : `url(${constants.URL_BACK}/files?guid=${el.main_image_guid}&width=900)`
                            : `url(${constants.URL_BACK}/files?guid=${el.main_image_guid})`,
                      }}
                    >
                      <div className="black_cover" />
                      <div className="carousel_cover">
                        <div className="center_div">
                          <p
                            className="category_badge"
                            onClick={() => this.selectCategory(el.category_id)}
                            onKeyDown={() =>
                              this.selectCategory(el.category_id)
                            }
                          >
                            {el.category_name}
                          </p>
                          <Link href={`/post?post_id=${el.post_id}`}>
                            <p className="title">{el.title}</p>
                          </Link>
                          <p className="subtitle">{el.subtitle}</p>
                        </div>
                        <div className="bottom_div">
                          {el.created_at
                            ? moment(el.created_at)
                                .tz(moment.tz.guess())
                                .format("YYYY년 M월 D일")
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </AliceCarousel>
            )}
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

          <section className="articles_list_wrap" ref={this.scrollDiv}>
            <div className="category_div">
              <div
                className={`category_badge ${!categoryId ? "active" : ""}`}
                onClick={() => this.selectCategory(undefined)}
                onKeyDown={() => this.selectCategory(undefined)}
              >
                전체보기
              </div>
              {categoryList.map((el, idx) => (
                <div
                  key={idx}
                  className={`category_badge ${
                    el.id === categoryId ? "active" : ""
                  }`}
                  onClick={() => this.selectCategory(el.id)}
                  onKeyDown={() => this.selectCategory(el.id)}
                >
                  {el.category_name}
                </div>
              ))}
            </div>

            <div className="articles_list_div">
              {postList.map((el, idx) => (
                <div key={idx} className="article_item">
                  <Link href={`/post?post_id=${el.post_id}`}>
                    <div className="picture_div">
                      <div
                        className="picture"
                        style={{
                          backgroundImage: `url(${constants.URL_BACK}/files?guid=${el.main_image_guid}&width=800)`,
                        }}
                      />
                    </div>
                  </Link>
                  <div className="info_div">
                    <div className="category_badge">{el.category_name}</div>
                    <Link href={`/post?post_id=${el.post_id}`}>
                      <p id={`content${el.post_id}`} className="title">
                        {el.title}
                      </p>
                    </Link>
                    <p className="description">{el.description}</p>
                    <Link href={`/post?post_id=${el.post_id}`}>
                      <p className="item_more_btn">MORE {">"}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {moreBtnStatus && (
              <div
                className="more_btn_div"
                onClick={this.addPage}
                onKeyDown={this.addPage}
              >
                <p>MORE</p>
                <div>
                  <img alt="더보기" src={DownArrow} />
                </div>
              </div>
            )}
          </section>

          <Footer />
        </div>
      </MainLayout>
    );
  }
}

export default withRouter(Main);
