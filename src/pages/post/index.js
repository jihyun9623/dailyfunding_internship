// import Link from "next/link";
import Router, { withRouter } from "next/router";

import { Swipeable } from "react-swipeable";
import { CopyToClipboard } from "react-copy-to-clipboard";
import swal from "sweetalert";

import CommentSection from "Components/Pages/CommentSection";
import Footer from "Components/Common/Footer/Footer";
import * as constants from "constants";

import LeftArrow from "@Img/white_left@2x.png";
import WhiteX from "@Img/white_x@2x.png";
import DailyFunding from "@Img/funding_logo.png";
import CommentIcon from "@Img/comment@2x.png";
import ShareIcon from "@Img/share.png";

import "./post.scss";

const sampleData = [
  {
    id: 1,
    category: "기획 아카이브",
    title: "크라우드펀딩이 하고 싶은 당신에게 말합니다",
    date: "2020년 2월 21일",
  },
  {
    id: 2,
    category: "기획 아카이브",
    title: "크라우드펀딩이 하고 싶은 당신에게 말합니다",
    date: "2020년 2월 21일",
  },
  {
    id: 3,
    category: "기획 아카이브",
    title: "크라우드펀딩이 하고 싶은 당신에게 말합니다",
    date: "2020년 2월 21일",
  },
  {
    id: 4,
    category: "기획 아카이브",
    title: "크라우드펀딩이 하고 싶은 당신에게 말합니다",
    date: "2020년 2월 21일",
  },
  {
    id: 5,
    category: "기획 아카이브",
    title: "크라우드펀딩이 하고 싶은 당신에게 말합니다",
    date: "2020년 2월 21일",
  },
  {
    id: 6,
    category: "기획 아카이브",
    title: "크라우드펀딩이 하고 싶은 당신에게 말합니다",
    date: "2020년 2월 21일",
  },
];

class Main extends React.Component {
  constructor() {
    super();

    this.state = {
      changeX: 0,
      windowSize: 0,
      commentNumber: "12",
      commentOpenStatus: true,
      commentList: [
        {
          id: 1,
          email: "kyh@daily-funding.com",
          date: "2020년 2월 21일",
          comment:
            "최고의 회식은 한달에 한번 목요일 두둑한 현금 인센티브와 함께 술없이 저녁 다 같이 먹고 2차부터는 각자 알아서 글고 다음날 전체 출근 노~",
          is_secret: false,
          is_mine: true,
          reply: [
            {
              id: 2,
              email: "kyh@daily-funding.com",
              date: "2020년 2월 21일",
              comment: "",
              is_secret: true,
              is_mine: false,
            },
            {
              id: 3,
              email: "kyh@daily-funding.com",
              date: "2020년 2월 21일",
              comment:
                "안녕하세요 좋은 정보 얻고 갑니다. ㅎ 전 요즘 너무 정신이 없어서 포스팅을 못 올리고 있네요 포스팅 올리는게 정말 쉬운게 아닌데 잘 보고 갑니다.",
              is_secret: true,
              is_mine: true,
            },
          ],
        },
        {
          id: 4,
          email: "kyh@daily-funding.com",
          date: "2020년 2월 21일",
          comment:
            "제가 있는 곳은 낮엔 완전 봄날같이 포근하네요 ㅎ 오후도 힘차게 파이팅입니다",
          is_secret: false,
          is_mine: true,
          reply: [
            {
              id: 5,
              email: "kyh@daily-funding.com",
              date: "2020년 2월 21일",
              comment: "",
              is_secret: true,
              is_mine: false,
            },
          ],
        },
      ],
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);

    this.setState({
      windowSize: window.innerWidth,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      windowSize: window.innerWidth,
    });
  };

  // 뒤로가기
  handleBack = () => {
    Router.back();
  };

  // 또 다른 인사이트 - 좌측으로 swipe
  handleSwipeLeft = () => {
    if (-sampleData.length + 1 < this.state.changeX) {
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
      changeX,
    } = this.state;

    return (
      <div className="dailyblog_post_wrapper">
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
              onClick={this.handleBack}
              onKeyDown={this.handleBack}
            />
          </div>

          <div className="post_header_wrap">
            <div className="black_cover">
              <div className="center_div">
                <p className="category_badge">기획 아카이브</p>
                <p className="title">
                  크라우드펀딩이 하고 싶은 당신에게 말합니다
                </p>
                <p className="subtitle">by 데일리언 정창언</p>
              </div>

              <div className="bottom_div">
                <img alt="데일리펀딩" src={DailyFunding} />
                <p>2020년 2월 21일</p>
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
            <div className="content">
              <h3>나만의 투자 원칙을 알려주세요.</h3>
              <br />
              <p>
                제가 투자 7년 차예요. 주변에서 부러워하거나 좋은 투자처를
                궁금해들 하시는데, 사실 부동산 투자가 절대 쉽지 않아요. 관리비,
                대출이자, 세금이 고정비로 드는 걸 생각하면 몇 달만 공실이어도
                바로 손해거든요.
              </p>
              <br />
              <p>
                노후 자금인 만큼 환금성을 꼭 생각하세요. 부동산 투자의 가장 큰
                단점 중 하나는 적어도 5년간 돈이 묶인다는 거예요. 팔려고 해도
                빨라야 한 달이고요. 그런 점에서 어니스트펀드가 좋더라고요.
                내년에 애들이 결혼한다고 할 수도 있고 무슨 일이 생길지 모르니까
                저는 투자 기간이 1년 이하인 상품을 주로 고르는데요. 현금 계획을
                짜기가 좋았습니다. 제 나이에는 ‘버는 투자’보다 ‘지키는 투자’가
                중요해요. 손실이 발생하면 회복할 수 있는 시간이 별로
                없거든요(웃음).
              </p>
              <br />
              <hr />
              <br />
              <h3>나만의 투자 원칙을 알려주세요.</h3>
              <br />
              <p>
                노후 자금인 만큼 환금성을 꼭 생각하세요. 부동산 투자의 가장 큰
                단점 중 하나는 적어도 5년간 돈이 묶인다는 거예요. 팔려고 해도
                빨라야 한 달이고요. 그런 점에서 어니스트펀드가 좋더라고요.
                내년에 애들이 결혼한다고 할 수도 있고 무슨 일이 생길지 모르니까
                저는 투자 기간이 1년 이하인 상품을 주로 고르는데요. 현금 계획을
                짜기가 좋았습니다. 제 나이에는 ‘버는 투자’보다 ‘지키는 투자’가
                중요해요. 손실이 발생하면 회복할 수 있는 시간이 별로
                없거든요(웃음). 저는 딸이 어니스트펀드에 먼저 투자하고 있었어요.
                사실 잘 모르는 스타트업에 투자하는 게 불안해 보였는데 2~3년간
                손해 없이 수익률을 잘 내더라고요. 믿을 수 있는 곳을 고르는 게
                어렵다면 저처럼 잘 아는 지인이 오래 투자하고 있는 곳을 선택하는
                것도 하나의 방법인 것 같아요.
              </p>
            </div>

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
                <button onClick={this.handleOpenComment}>
                  <img alt="댓글" src={CommentIcon} />
                  <span className="text">댓글</span>
                  <span className="comment_number_mob">{commentNumber}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 댓글 섹션 */}
          {commentOpenStatus && (
            <CommentSection
              commentNumber={commentNumber}
              commentList={commentList}
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
                {sampleData.map((el, idx) => (
                  <div key={idx} className="item">
                    <div className="image_div">
                      <div className="category">{el.category}</div>
                    </div>
                    <div className="info_div">
                      <p className="article_title">{el.title}</p>
                      <p className="date">{el.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Swipeable
                onSwipedLeft={() => this.handleSwipeLeft()}
                onSwipedRight={() => this.handleSwipeRight()}
                className="insight_items_div_mob"
              >
                {sampleData.map((el, idx) => (
                  <div
                    key={idx}
                    className="item"
                    style={{
                      marginLeft:
                        idx === 0 && changeX * windowSize - changeX * 39,
                    }}
                  >
                    <div className="image_div">
                      <div className="category">{el.category}</div>
                    </div>
                    <div className="info_div">
                      <p className="article_title">{el.title}</p>
                      <p className="date">{el.date}</p>
                    </div>
                  </div>
                ))}
              </Swipeable>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    );
  }
}

export default withRouter(Main);
