import { Router } from "next/router";

import swal from "sweetalert";
import * as moment from "moment";

import { getFetch, postFetch, deleteFetch } from "Utils/GetFetch";
import * as constants from "constants.js";

import "./CommentSection.scss";

import SecretIcon from "@Img/secret_on@2x.png";
import NotSecretIcon from "@Img/secret_off@2x.png";
import ReplyIcon from "@Img/reply@2x.png";
import ToIcon from "@Img/to@2x.png";

class CommentSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      admin: false,
      postId: props.postId,
      commentNumber: props.commentNumber,
      commentList: props.commentList,
    };

    // this.inputFocus = React.createRef();
  }

  componentDidMount = () => {
    this.setState({
      token: localStorage.getItem("ACTK"),
    });

    // 관리자인지 체크
    getFetch("/users/admin-check", { token: "any" }, this.adminCheckRes);
  };

  adminCheckRes = (response) => {
    if (response.message === "ADMIN_CHECK_SUCCESS") {
      this.setState({ admin: true });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.commentList !== this.props.commentList) {
      this.setState({
        commentList: this.props.commentList,
      });
    }

    if (prevProps.commentNumber !== this.props.commentNumber) {
      this.setState({
        commentNumber: this.props.commentNumber,
      });
    }
  };

  // 비로그인 유저일 경우 PHP 로그인 API 호출
  linkLoginPage = () => {
    swal({
      text: "로그인 후 댓글 작성이 가능합니다. 로그인 하시겠습니까?",
      buttons: ["취소", "확인"],
    }).then((isTrue) => {
      if (isTrue) {
        window.open(
          `${
            constants.URL_LOGIN
          }/bbs/login.php?from=dailyblog&fromurl=${encodeURIComponent(
            `/post?post_id=${this.state.postId}`,
          )}`,
        );
      }
    });
  };

  // 숫자가 0일 경우 아무것도 반환하지 않고 그 외의 숫자일 경우 return
  returnCommentNum = (num) => {
    if (isNaN(Number(num))) {
      return;
    } else if (Number(num) === 0) {
      return;
    } else {
      return Number(num);
    }
  };

  // 댓글, 답글(대댓글), 수정중인 댓글의 비밀댓글 여부 변경
  // (이 함수 하나로 처리, 인자로 key 넘겨줌)
  handleIsCommentSecret = (key) => {
    this.setState((prevState) => ({
      [key]: !prevState[key],
    }));
  };

  // 답글(대댓글) 입력창 여닫는 function
  handleReplyingId = (id) => {
    const { replyingId, replyData } = this.state;

    if (replyingId && replyData) {
      // 답글창이 열려 있고, 작성중이던 답글이 있을 경우
      swal({
        text: "작성중인 댓글이 있습니다. 삭제하시겠습니까?",
        buttons: ["취소", "확인"],
      }).then((isTrue) => {
        if (isTrue) {
          this.setState((prevState) => ({
            replyingId: prevState.replyingId === id ? undefined : id,
            replyData: "",
            edittingComment: undefined,
            edittingCommentData: "",
          }));
        }
      });
    } else if (replyingId && !replyData) {
      // 답글 창이 열려 있지만, 작성중이던 내용은 없는 경우
      this.setState((prevState) => ({
        replyingId: prevState.replyingId === id ? undefined : id,
        edittingComment: undefined,
        edittingCommentData: "",
      }));
    } else {
      // 열려 있는 답글 창이 아무것도 없던 경우
      this.setState({
        replyingId: id,
        edittingComment: undefined,
        edittingCommentData: "",
      });
    }
  };

  // 댓글 삭제 처리
  handleDeleteComment = (id) => {
    swal({
      text: "해당 댓글을 삭제하시겠습니까?",
      buttons: ["취소", "확인"],
    }).then((isTrue) => {
      if (isTrue) {
        deleteFetch(
          "/comments",
          JSON.stringify({
            id,
          }),
          this.handleDeleteCommentRes,
        );
      }
    });
  };

  handleDeleteCommentRes = (res) => {
    if (res.message === "COMMENT_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 댓글입니다.",
        button: "확인",
      }).then(() => this.props.getCommentList());
    } else if (res.message === "PERMISSION_DENIED") {
      swal({
        text: "댓글 작성자 본인만이 댓글을 삭제할 수 있습니다.",
        button: "확인",
      }).then(() => this.props.getCommentList());
    } else if (res.message === "DELETE_SUCCESS") {
      this.props.getCommentList();
    } else {
      swal({
        text: "알 수 없는 오류로 댓글 삭제에 실패했습니다. 다시 시도해주세요.",
        button: "확인",
      }).then(() => this.props.getCommentList());
    }
  };

  // 어떤 댓글, 답글이 수정중인지에 대한 처리 (댓글, 답글 둘 다 한 함수로 처리)
  handleEditComment = (el) => {
    this.setState((prevState) => ({
      replyingId: undefined,
      replyData: "",
      edittingComment: el.id,
      edittingCommentIsSecret: el.is_secret,
      edittingCommentData:
        prevState.edittingComment === el.id
          ? prevState.edittingCommentData
          : el.content,
    }));
  };

  // 댓글 수정창 / 댓글 텍스트 둘 중 하나를 렌더하는 function
  renderEditOrComment = (id, comment, replyTarget) => {
    const {
      edittingComment,
      edittingCommentIsSecret,
      edittingCommentData,
    } = this.state;

    return edittingComment === id ? (
      <div className="comment_write_div comment_edit">
        <textarea
          name="edittingCommentData"
          defaultValue={comment}
          onChange={this.setInput}
        />
        <div className="write_bottom_div">
          <p>
            <img
              alt={edittingCommentIsSecret ? "비밀댓글" : "비밀댓글 아님"}
              src={edittingCommentIsSecret ? SecretIcon : NotSecretIcon}
              onClick={() =>
                this.handleIsCommentSecret("edittingCommentIsSecret")
              }
              onKeyDown={() =>
                this.handleIsCommentSecret("edittingCommentIsSecret")
              }
            />
            {edittingCommentIsSecret ? "비밀댓글" : ""}
          </p>
          <div>
            <button
              className={edittingCommentData ? "active" : ""}
              onClick={this.confirmEditComment}
            >
              확인
            </button>
            <button onClick={this.cancelEditComment}>취소</button>
          </div>
        </div>
      </div>
    ) : (
      <p className="comment">
        {replyTarget && (
          <span>
            <img src={ToIcon} alt="to." />
            {replyTarget}{" "}
          </span>
        )}
        {comment}
      </p>
    );
  };

  // 댓글 수정 완료 (댓글, 답글 둘 다 한 함수로 처리)
  confirmEditComment = () => {
    const {
      edittingComment,
      edittingCommentData,
      edittingCommentIsSecret,
    } = this.state;

    if (!edittingCommentData) {
      swal({
        text: "내용이 존재하지 않습니다. 댓글을 삭제하시겠습니까?",
        buttons: ["취소", "확인"],
      }).then((isTrue) => {
        if (isTrue) {
          this.handleDeleteComment(edittingComment);
        }
      });
    } else {
      postFetch(
        "/comments/update",
        { token: true },
        JSON.stringify({
          id: edittingComment,
          is_secret: edittingCommentIsSecret,
          content: edittingCommentData,
        }),
        this.confirmEditCommentRes,
      );
    }
  };

  confirmEditCommentRes = (res) => {
    if (res.message === "COMMENT_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 댓글입니다.",
        button: "확인",
      }).then(() => {
        this.props.getCommentList();

        this.setState({
          edittingCommentData: "",
          edittingCommentIsSecret: false,
        });
      });
    } else if (res.message === "UPDATE_SUCCESS") {
      this.props.getCommentList();

      this.setState({
        edittingComment: undefined,
        edittingCommentData: "",
        edittingCommentIsSecret: false,
      });
    }
  };

  // 댓글 수정 취소 (댓글, 답글 둘 다 한 함수로 처리)
  cancelEditComment = () => {
    this.setState({
      edittingComment: undefined,
      edittingCommentIsSecret: undefined,
      edittingCommentData: "",
    });
  };

  // 답글 창을 렌더하는 function
  renderReplyDiv = (id, author, noBorder) => {
    const {
      token,
      // 대댓글(답글) 관련
      replyingId,
      isSecretReply,
      replyData,
    } = this.state;

    return (
      // 답글(대댓글) 작성란
      replyingId === id && (
        <div
          className="comment_item now_reply_writing"
          style={noBorder ? { borderTop: "none" } : { width: "100%" }}
        >
          <div className="reply_icon" />
          <div className="reply_body">
            <div className="comment_write_div now_reply_writing">
              <textarea
                name="replyData"
                placeholder={
                  token
                    ? `${author}님에게 댓글 달기`
                    : "데일리펀딩에 로그인하고 댓글을 입력해보세요!"
                }
                onChange={this.setInput}
                value={replyData || ""}
                onClick={!token ? this.linkLoginPage : () => {}}
                readOnly={!token}
              />
              <div className="write_bottom_div">
                <p>
                  <img
                    alt={isSecretReply ? "비밀댓글" : "비밀댓글 아님"}
                    src={isSecretReply ? SecretIcon : NotSecretIcon}
                    onClick={
                      token
                        ? () => this.handleIsCommentSecret("isSecretReply")
                        : this.linkLoginPage
                    }
                    onKeyDown={
                      token
                        ? () => this.handleIsCommentSecret("isSecretReply")
                        : this.linkLoginPage
                    }
                  />
                  {isSecretReply ? "비밀댓글" : ""}
                </p>
                <button
                  className={replyData ? "active" : ""}
                  onClick={token ? this.publishNewReply : this.linkLoginPage}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    );
  };

  // 새 댓글을 등록하는 함수
  publishNewComment = () => {
    const { postId, isSecretComment, commentData } = this.state;

    if (!commentData) {
      swal({
        text: "내용을 입력해주세요.",
        button: "확인",
      });
    } else {
      postFetch(
        "/comments",
        { token: true },
        JSON.stringify({
          post_id: postId,
          is_secret: isSecretComment,
          content: commentData,
        }),
        this.publishNewCommentRes,
      );
    }
  };

  // 새 답글(대댓글)을 등록하는 함수
  publishNewReply = () => {
    const { postId, isSecretReply, replyingId, replyData } = this.state;

    if (!replyData) {
      swal({
        text: "내용을 입력해주세요.",
        button: "확인",
      });
    } else {
      postFetch(
        "/comments",
        { token: true },
        JSON.stringify({
          post_id: postId,
          is_secret: isSecretReply,
          reply_target_id: replyingId,
          content: replyData,
        }),
        this.publishNewCommentRes,
      );
    }
  };

  publishNewCommentRes = (res) => {
    if (res.message === "POST_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 게시글입니다.",
        button: "확인",
      }).then(() => {
        if (window.history.length !== 1) {
          Router.back();
        } else {
          // 히스토리가 없을 때에는 메인 페이지로 리다이렉트
          Router.push("/");
        }
      });
    } else if (res.message === "COMMENT_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 댓글입니다.",
        button: "확인",
      }).then(() => {
        this.props.getCommentList();

        this.setState({
          commentData: "",
          isSecretComment: false,
          replyData: "",
          isSecretReply: false,
          replyingId: undefined,
        });
      });
    } else if (res.message === "CREATE_SUCCESS") {
      this.props.getCommentList();

      this.setState({
        commentData: "",
        isSecretComment: false,
        replyData: "",
        isSecretReply: false,
        replyingId: undefined,
      });
    } else {
      swal({
        text: "댓글 작성에 실패했습니다. 다시 시도해주세요.",
        button: "확인",
      });
    }
  };

  setInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const {
      token,
      admin,
      commentNumber,
      commentList,
      edittingComment,
      // 댓글 관련
      isSecretComment,
      commentData,
      // 대댓글(답글) 관련
      replyingId,
    } = this.state;

    return (
      <section className="comment_wrap">
        <div className="comment_inner">
          <div className="comment_top_div">
            <p>
              댓글
              <span>{this.returnCommentNum(commentNumber)}</span>
            </p>
            <div />
          </div>

          {commentList.length !== 0 && (
            <div className="comment_list_div">
              {commentList.map((el, idx) => (
                <div key={idx}>
                  {/* 코멘트 */}
                  <div
                    className={`comment_item ${
                      edittingComment === el.id ? "editting_comment_item" : ""
                    }`}
                    style={{
                      borderBottom:
                        el.reply.length === 0 ? "none" : "1px solid #dddddd",
                    }}
                  >
                    <div className="comment_info">
                      <div
                        className="left_info"
                        style={
                          el.is_secret && el.content && el.content.length === 0
                            ? { marginBottom: 0 }
                            : { marginBottom: 7 }
                        }
                      >
                        <p className="email">
                          {el.is_secret && !el.content && !el.deleted
                            ? "비밀 댓글입니다"
                            : el.author}
                          {el.deleted && "삭제된 댓글입니다"}
                        </p>
                        {!el.deleted && (
                          <>
                            <p className="dot" />
                            <p className="date">
                              {moment(el.created_at).format("YYYY년 M월 D일")}
                            </p>
                          </>
                        )}
                        {el.is_secret && admin && (
                          <img
                            className="secret_icon"
                            alt="비밀댓글"
                            src={SecretIcon}
                          />
                        )}
                        {((!el.is_secret && !el.deleted) || admin) && (
                          <button onClick={() => this.handleReplyingId(el.id)}>
                            <img alt="답글 달기" src={ReplyIcon} />
                            {replyingId === el.id ? "취소" : "댓글"}
                          </button>
                        )}
                      </div>
                      {el.is_mine && (
                        <div className="right_buttons">
                          <button onClick={() => this.handleEditComment(el)}>
                            수정
                          </button>
                          <button
                            onClick={() => this.handleDeleteComment(el.id)}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 수정 상태로 변할 경우 */}
                    {this.renderEditOrComment(
                      el.id,
                      el.content,
                      el.reply_target,
                    )}
                  </div>

                  {/* 답글 */}
                  {el.reply && (
                    <div className="reply_wrap">
                      {el.reply.map((el2, idx2) => (
                        <div key={idx2}>
                          <div
                            className={`comment_item ${
                              edittingComment === el2.id
                                ? "editting_comment_item"
                                : ""
                            }`}
                          >
                            <div className="reply_icon" />
                            <div className="reply_body">
                              <div className="comment_info">
                                <div
                                  className="left_info"
                                  style={
                                    el2.is_secret &&
                                    el2.content &&
                                    el2.content.length === 0
                                      ? { marginBottom: 0 }
                                      : { marginBottom: 7 }
                                  }
                                >
                                  <p className="email">
                                    {el2.is_secret &&
                                    !el2.content &&
                                    !el2.deleted
                                      ? "비밀 댓글입니다"
                                      : el2.author}
                                    {el2.deleted && "삭제된 댓글입니다"}
                                  </p>
                                  {!el2.deleted && (
                                    <>
                                      <p className="dot" />
                                      <p className="date">
                                        {moment(el2.created_at).format(
                                          "YYYY년 M월 D일",
                                        )}
                                      </p>
                                    </>
                                  )}
                                  {el2.is_secret && admin && (
                                    <img
                                      className="secret_icon"
                                      alt="비밀댓글"
                                      src={SecretIcon}
                                    />
                                  )}
                                  {((!el2.is_secret && !el2.deleted) ||
                                    admin) && (
                                    <button
                                      onClick={() =>
                                        this.handleReplyingId(el2.id)
                                      }
                                    >
                                      <img alt="답글 달기" src={ReplyIcon} />
                                      {replyingId === el2.id ? "취소" : "댓글"}
                                    </button>
                                  )}
                                </div>
                                {el2.is_mine && (
                                  <div className="right_buttons">
                                    <button
                                      onClick={() =>
                                        this.handleEditComment(el2)
                                      }
                                    >
                                      수정
                                    </button>
                                    <button>삭제</button>
                                  </div>
                                )}
                              </div>

                              {/* 수정 상태로 변할 경우 */}
                              {this.renderEditOrComment(
                                el2.id,
                                el2.content,
                                el2.reply_target,
                              )}
                            </div>
                          </div>

                          {/* 대댓글에 댓글을 달 경우... */}
                          {this.renderReplyDiv(el2.id, el2.author)}
                        </div>
                      ))}

                      {/* 댓글에 댓글을 달 경우... */}
                      {this.renderReplyDiv(el.id, el.author, true)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="comment_write_div">
            <textarea
              name="commentData"
              placeholder={
                token
                  ? "댓글은 큰 힘이 됩니다."
                  : "데일리펀딩에 로그인하고 댓글을 입력해보세요!"
              }
              onChange={this.setInput}
              value={commentData || ""}
              onClick={!token ? this.linkLoginPage : () => {}}
              readOnly={!token}
            />
            <div className="write_bottom_div">
              <p>
                <img
                  alt={isSecretComment ? "비밀댓글" : "비밀댓글 아님"}
                  src={isSecretComment ? SecretIcon : NotSecretIcon}
                  onClick={
                    token
                      ? () => this.handleIsCommentSecret("isSecretComment")
                      : this.linkLoginPage
                  }
                  onKeyDown={
                    token
                      ? () => this.handleIsCommentSecret("isSecretComment")
                      : this.linkLoginPage
                  }
                />
                {isSecretComment ? "비밀댓글" : ""}
              </p>
              <button
                className={commentData ? "active" : ""}
                onClick={token ? this.publishNewComment : this.linkLoginPage}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default CommentSection;
