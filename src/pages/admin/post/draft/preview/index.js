import Link from "next/link";
import { withRouter } from "next/router";
import Head from "next/head";

import { Swipeable } from "react-swipeable";
import swal from "sweetalert";
import * as moment from "moment";
import "moment-timezone";

import { getFetch } from "Utils/GetFetch";
import { queryToObject, objectToQuerystring } from "Utils/QueryString";
import * as constants from "constants";

import LeftArrow from "@Img/white_left@2x.png";
import WhiteX from "@Img/white_x@2x.png";
import DailyFunding from "@Img/funding_logo.png";
import CommentIcon from "@Img/comment@2x.png";
import ShareIcon from "@Img/share.png";

import "pages/post/post.scss";

class DraftPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      draftId: Number(queryToObject(this.props.router.asPath).draft_id) || "",
      changeX: 0,
      windowSize: 0,
      insightList: [],
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);

    this.setState({
      windowSize: window.innerWidth,
    });

    // 포스트 정보 get
    getFetch(
      `/posts/preview/admin?id=${this.state.draftId}`,
      { token: true },
      this.getPostPreviewInfoRes,
    );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  getPostPreviewInfoRes = (res) => {
    if (res.message === "POST_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 포스트입니다.",
        button: "확인",
      }).then(() => window.close());
    } else if (res.post_info) {
      const info = res.post_info;

      this.setState(
        {
          categoryId: info.category_id,
          categoryName: info.category_name || "",
          title: info.title || "",
          subtitle: info.subtitle || "",
          content: info.content,
          mainImageGuid: info.main_image_guid,
          allowComment: info.allow_comment,
          createdAt: info.created_at || "",
        },
        () => {
          // 또 다른 인사이트 리스트
          this.getInsightList();
        },
      );
    }
  };

  handleWindowResize = () => {
    this.setState({
      windowSize: window.innerWidth,
    });
  };

  // 또 다른 인사이트 리스트 받아오기 (같은 카테고리의 포스트들)
  getInsightList = () => {
    const { draftId, categoryId } = this.state;
    const params = {};

    categoryId && (params.category_id = categoryId);
    params.post_id = draftId;
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

  filterCreatedAt = (createdAt) => {
    if (createdAt) {
      return moment(createdAt).tz(moment.tz.guess()).format("YYYY년 M월 D일");
    } else {
      return "";
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

  render() {
    const {
      windowSize,
      commentNumber,
      insightList,
      changeX,
      draftId,
      categoryId,
      categoryName,
      title,
      subtitle,
      content,
      mainImageGuid,
      allowComment,
      createdAt,
    } = this.state;

    return !draftId ? (
      <div />
    ) : (
      <div className="dailyblog_post_wrapper">
        {/* dynamic meta tag */}
        <Head>
          <title>임시저장 글 미리보기</title>
          <meta id="og-type" property="og:type" content="website" />
          <meta
            id="og-title"
            property="og:title"
            content="임시저장 글 미리보기"
          />
          <meta property="og:image" content="Img/sns_logo.png" />
        </Head>

        <header>
          <div className="top_div">
            <img alt="뒤로가기" src={LeftArrow} />
            <img alt="뒤로가기" src={WhiteX} />
          </div>

          <div
            className="post_header_wrap"
            style={{
              backgroundImage:
                windowSize <= 768
                  ? windowSize <= 414
                    ? `url(${constants.URL_BACK}/files?guid=${mainImageGuid}&height=600)`
                    : `url(${constants.URL_BACK}/files?guid=${mainImageGuid}&height=700)`
                  : `url(${constants.URL_BACK}/files?guid=${mainImageGuid})`,
            }}
          >
            <div className="black_cover" />
            <div className="post_head_cover">
              <div className="center_div">
                <Link href={`/?category_id=${categoryId}`}>
                  <p className="category_badge">{categoryName}</p>
                </Link>
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
          <section className="article_content_wrap closed">
            <article
              className="content"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="post_bottom_btn_wrap">
              {/* 공유, 댓글 버튼 */}
              <div className="button_div">
                <button>
                  <img alt="공유" src={ShareIcon} style={{ marginBottom: 3 }} />
                  <span className="text">공유</span>
                </button>

                {allowComment && (
                  <button>
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

          {/* 데일리언과 함께하기 */}
          <section className="dailian_wrap">
            <div className="black_cover" />
            <div className="text_cover">
              <div>
                <p>
                  우리는 지속가능한 금융을 만들어가는 <br />
                  투명한 종합 금융 플랫폼입니다.
                </p>
                <u>데일리언과 함께하기 {">"}</u>
              </div>
            </div>
          </section>

          {/* 또 다른 인사이트 */}
          <section className="another_insight_wrap">
            <div className="another_insight_inner">
              <p className="title">또 다른 인사이트</p>
              <div className="insight_items_div_pc">
                {insightList.map((el, idx) => (
                  <div key={idx} className="item">
                    <div
                      className="image_div"
                      style={{
                        backgroundImage: `url(${constants.URL_BACK}/files?guid=${el.main_image_guid}&width=400)`,
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
                  <div
                    key={idx}
                    className="item"
                    style={{
                      marginLeft:
                        idx === 0 && changeX * windowSize - changeX * 39,
                    }}
                  >
                    <div
                      className="image_div"
                      style={{
                        backgroundImage: `url(${constants.URL_BACK}/files?guid=${el.main_image_guid}&width=600)`,
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
                ))}
              </Swipeable>
            </div>
          </section>
          {/* <Footer /> */}
        </div>
      </div>
    );
  }
}

export default withRouter(DraftPreview);
