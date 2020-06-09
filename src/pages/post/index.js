import Link from "next/link";
import Router, { withRouter } from "next/router";
import Head from "next/head";

import { Swipeable } from "react-swipeable";
import { CopyToClipboard } from "react-copy-to-clipboard";
import swal from "sweetalert";
import * as moment from "moment";

import MainLayout from "Components/Common/Layout/MainLayout/MainLayout";
import Footer from "Components/Common/Footer/Footer";
import CommentSection from "Components/Pages/CommentSection";
import { getFetch } from "Utils/GetFetch";
import { queryToObject, objectToQuerystring } from "Utils/QueryString";
import * as constants from "constants";

import LeftArrow from "@Img/white_left@2x.png";
import WhiteX from "@Img/white_x@2x.png";
import DailyFunding from "@Img/funding_logo.png";
import CommentIcon from "@Img/comment@2x.png";
import ShareIcon from "@Img/share.png";

import "./post.scss";

class Main extends React.Component {
  // getServerSideProps 로 변경 예정
  static async getInitialProps({ asPath }) {
    // 포스트 정보 prefetch
    let res;
    const postId = Number(queryToObject(asPath).post_id);

    // 포스트 id 가 있을 경우에만 정보를 받아옴
    if (postId) {
      await fetch(`${constants.URL_BACK}/posts?id=${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.post_info) {
            res = response.post_info;
          } else if (response.message === "POST_DOES_NOT_EXIST") {
            swal({
              text: "존재하지 않는 게시글입니다.",
              button: "확인",
            }).then(() => Router.push("/"));
          }
        })
        .catch((err) => {
          console.log(err);
        });

      if (res) {
        return {
          categoryId: res.category_id,
          categoryName: res.category_name || "",
          title: res.title || "",
          subtitle: res.subtitle || "",
          description: res.description || "",
          content: res.content,
          mainImageGuid: res.main_image_guid,
          allowComment: res.allow_comment,
          createdAt: res.created_at || "",
        };
      } else {
        return {
          title: "",
        };
      }
    } else {
      return {
        title: "",
      };
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      postId: Number(queryToObject(this.props.router.asPath).post_id) || "",
      loginGuid: queryToObject(this.props.router.asPath).guid || "",
      changeX: 0,
      windowSize: 0,
      commentOpenStatus: false,
      insightList: [],
      commentList: [],
    };
  }

  componentDidMount() {
    if (!queryToObject(this.props.router.asPath).post_id) {
      Router.push("/");
    }

    window.addEventListener("resize", this.handleWindowResize);

    this.setState({
      windowSize: window.innerWidth,
    });

    // 또 다른 인사이트 리스트
    this.getInsightList();

    // 코멘트 리스트
    this.getCommentList();

    // 테스트
    // localStorage.setItem(
    //   "ACTK",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2VtYWlsIjoidGVtcEBkYWlseS5jb20iLCJleHAiOjE1OTExNzA3MDQuNDU5ODc1fQ.QkCxJT8w7t6LPpmNNkVK8qT4ZuhSrIC-qAPA2A7I0j0",
    // );
    // localStorage.setItem(
    //   "RFTK",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2VtYWlsIjoidGVtcEBkYWlseS5jb20iLCJleHAiOjE1OTEyMzQ3MzUuMDczOTU2fQ.Sd0vPKY74ozPfarU5y1F1sqN5QL3ZeMo12V9Jeacg-c",
    // );
  }

  componentDidUpdate = (prevProps) => {
    // parameter 가 바뀔 경우 comment list 를 다시 받아오는 로직
    if (prevProps.router.asPath !== this.props.router.asPath) {
      this.setState(
        {
          commentOpenStatus: false,
          postId: Number(queryToObject(this.props.router.asPath).post_id) || "",
        },
        () => {
          this.getCommentList();
          window.scroll(0, 0);
        },
      );
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      windowSize: window.innerWidth,
    });
  };

  // 또 다른 인사이트 리스트 받아오기 (같은 카테고리의 포스트들)
  getInsightList = () => {
    const { categoryId } = this.props;
    const params = {};

    categoryId && (params.category_id = categoryId);
    params.item_count = 6;

    getFetch(
      `/posts/list${objectToQuerystring(params)}`,
      { token: "any" },
      this.getInsightListRes,
    );
  };

  getInsightListRes = (res) => {
    if (res.post_list) {
      this.setState({
        insightList: res.post_list,
      });
    }
  };

  // 코멘트 리스트 받아오기
  getCommentList = () => {
    getFetch(
      `/comments/list?post_id=${this.state.postId}`,
      { token: "any" },
      this.getCommentListRes,
    );
  };

  getCommentListRes = (res) => {
    if (res.message === "POST_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 게시글입니다.",
        button: "확인",
      }).then(() => this.handleBack());
    } else if (res.comment_list) {
      this.setState({
        commentList: res.comment_list,
        commentNumber: res.comment_list.length,
      });
    }
  };

  filterCreatedAt = (createdAt) => {
    if (createdAt) {
      return moment(createdAt).format("YYYY년 M월 D일");
    } else {
      return "";
    }
  };

  // 뒤로가기
  handleBack = () => {
    if (window.history.length !== 1 && !this.state.loginGuid) {
      Router.back();
    } else if (this.state.loginGuid) {
      Router.push("/");
    } else {
      // 히스토리가 없을 때에는 메인 페이지로 리다이렉트
      Router.push("/");
    }
  };

  // 단순 뒤로가기가 아닌, 메인 페이지로 이동
  handleBackToMain = () => {
    if (window.history.length !== 1 && !this.state.loginGuid) {
      Router.back();
    } else if (this.state.loginGuid) {
      Router.push("/");
    } else {
      // 히스토리가 없을 때에는 메인 페이지로 리다이렉트
      Router.push("/");
    }
  };

  // 또 다른 인사이트 - 좌측으로 swipe
  handleSwipeLeft = () => {
    const { insightList } = this.state;

    if (-insightList.length + 1 < this.state.changeX) {
      this.setState((prevState) => ({
        changeX: prevState.changeX - 1,
      }));
    }
  };

  // 또 다른 인사이트 - 우측으로 swipe
  handleSwipeRight = () => {
    if (this.state.changeX < 0) {
      this.setState((prevState) => ({
        changeX: prevState.changeX + 1,
      }));
    }
  };

  // 공유하기 버튼 눌렀을 경우
  handleCopyPopup = () => {
    swal({ text: "클립보드에 복사되었습니다.", button: "확인" });
    // swal({ text: "댓글을 삭제하시겠습니까?", buttons: ["취소", "확인"] });
  };

  // 댓글 입력창 여닫는 function
  handleOpenComment = () => {
    this.setState((prevState) => ({
      commentOpenStatus: !prevState.commentOpenStatus,
    }));
  };

  render() {
    const {
      windowSize,
      commentOpenStatus,
      commentNumber,
      commentList,
      insightList,
      changeX,
      postId,
    } = this.state;

    const {
      categoryName,
      title,
      subtitle,
      description,
      content,
      mainImageGuid,
      allowComment,
      createdAt,
    } = this.props;

    return !postId ? (
      <MainLayout>
        <div />
      </MainLayout>
    ) : (
      <MainLayout>
        <div className="dailyblog_post_wrapper">
          {/* dynamic meta tag */}
          <Head>
            <title>{title}</title>
            <meta id="og-type" property="og:type" content="website" />
            <meta id="og-title" property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta
              property="og:image"
              content={`${constants.URL_BACK}/files?guid=${mainImageGuid}`}
            />
          </Head>

          <header>
            <div className="top_div">
              <img
                alt="뒤로가기"
                src={LeftArrow}
                onClick={this.handleBack}
                onKeyDown={this.handleBack}
              />
              <img
                alt="뒤로가기"
                src={WhiteX}
                onClick={this.handleBackToMain}
                onKeyDown={this.handleBackToMain}
              />
            </div>

            <div
              className="post_header_wrap"
              style={{
                backgroundImage:
                  windowSize <= 768
                    ? windowSize <= 414
                      ? `url(${constants.URL_BACK}/files?guid=${mainImageGuid}&width=550)`
                      : `url(${constants.URL_BACK}/files?guid=${mainImageGuid}&width=900)`
                    : `url(${constants.URL_BACK}/files?guid=${mainImageGuid})`,
              }}
            >
              <div className="black_cover" />
              <div className="post_head_cover">
                <div className="center_div">
                  <p className="category_badge">{categoryName}</p>
                  <h1 className="title">{title}</h1>
                  <p className="subtitle">{subtitle}</p>
                </div>

                <div className="bottom_div">
                  <img alt="데일리펀딩" src={DailyFunding} />
                  <p>{this.filterCreatedAt(createdAt)}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="body_div">
            {/* 본문, 코멘트 */}
            <section
              className={`article_content_wrap ${
                commentOpenStatus ? "" : "closed"
              }`}
            >
              <article
                className="content"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              <div className="post_bottom_btn_wrap">
                {/* 공유, 댓글 버튼 */}
                <div className="button_div">
                  <CopyToClipboard
                    text={constants.URL_FRONT + this.props.router.asPath}
                    onCopy={this.handleCopyPopup}
                  >
                    <button>
                      <img
                        alt="공유"
                        src={ShareIcon}
                        style={{ marginBottom: 3 }}
                      />
                      <span className="text">공유</span>
                    </button>
                  </CopyToClipboard>

                  {allowComment && (
                    <button onClick={this.handleOpenComment}>
                      <img alt="댓글" src={CommentIcon} />
                      <span className="text">댓글</span>
                      {commentNumber !== 0 && (
                        <span className="comment_number">{commentNumber}</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* 댓글 섹션 */}
            {commentOpenStatus && (
              <CommentSection
                postId={postId}
                commentNumber={commentNumber}
                commentList={commentList}
                getCommentList={this.getCommentList}
              />
            )}

            {/* 데일리언과 함께하기 */}
            <section className="dailian_wrap">
              <div className="black_cover" />
              <div className="text_cover">
                <div>
                  <p>
                    우리는 지속가능한 금융을 만들어가는 <br />
                    투명한 종합 금융 플랫폼입니다.
                  </p>
                  <a
                    href="https://www.xn--2n1b71jm8kvwb.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <u>데일리언과 함께하기 {">"}</u>
                  </a>
                </div>
              </div>
            </section>

            {/* 또 다른 인사이트 */}
            <section className="another_insight_wrap">
              <div className="another_insight_inner">
                <p className="title">또 다른 인사이트</p>
                <div className="insight_items_div_pc">
                  {insightList.map((el, idx) => (
                    <Link key={idx} href={`/post?post_id=${el.post_id}`}>
                      <div className="item">
                        <div
                          className="image_div"
                          style={{
                            backgroundImage: `url(${constants.URL_BACK}/files?guid=${el.main_image_guid})`,
                          }}
                        >
                          <div className="category_div">
                            {el.category_name}
                            <div className="black_back" />
                            <span>{el.category_name}</span>
                          </div>
                        </div>
                        <div className="info_div">
                          <p className="article_title">{el.title}</p>
                          <p className="date">
                            {this.filterCreatedAt(el.created_at)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <Swipeable
                  onSwipedLeft={() => this.handleSwipeLeft()}
                  onSwipedRight={() => this.handleSwipeRight()}
                  className={`insight_items_div_mob ${
                    insightList.length === 1 ? "one" : ""
                  }`}
                >
                  {insightList.map((el, idx) => (
                    <Link key={idx} href={`/post?post_id=${el.post_id}`}>
                      <div
                        className="item"
                        style={{
                          marginLeft:
                            idx === 0 && changeX * windowSize - changeX * 39,
                        }}
                      >
                        <div
                          className="image_div"
                          style={{
                            backgroundImage: `url(${constants.URL_BACK}/files?guid=${el.main_image_guid})`,
                          }}
                        >
                          <div className="category_div">
                            {el.category_name}
                            <div className="black_back" />
                            <span>{el.category_name}</span>
                          </div>
                        </div>
                        <div className="info_div">
                          <p className="article_title">{el.title}</p>
                          <p className="date">
                            {this.filterCreatedAt(el.created_at)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </Swipeable>
              </div>
            </section>
            <Footer />
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default withRouter(Main);
