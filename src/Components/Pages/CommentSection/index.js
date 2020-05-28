import swal from "sweetalert";

import "./CommentSection.scss";

import SecretIcon from "@Img/secret_on@2x.png";
import NotSecretIcon from "@Img/secret_off@2x.png";
import ReplyIcon from "@Img/reply@2x.png";

class CommentSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commentNumber: props.commentNumber,
      commentList: props.commentList,
    };

    // this.inputFocus = React.createRef();
  }

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
          : el.comment,
    }));
  };

  // 댓글 수정 취소 (댓글, 답글 둘 다 한 함수로 처리)
  cancelEditComment = () => {
    this.setState({
      edittingComment: undefined,
      edittingCommentIsSecret: undefined,
      edittingCommentData: "",
    });
  };

  // 댓글 수정창 / 댓글 텍스트 둘 중 하나를 렌더하는 function
  renderEditOrComment = (id, comment) => {
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
            <button className={edittingCommentData ? "active" : ""}>
              확인
            </button>
            <button onClick={this.cancelEditComment}>취소</button>
          </div>
        </div>
      </div>
    ) : (
      <p className="comment">{comment}</p>
    );
  };

  // 답글 창을 렌더하는 function
  renderReplyDiv = (id, noBorder) => {
    const {
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
                placeholder="댓글은 큰 힘이 됩니다."
                onChange={this.setInput}
                value={replyData || ""}
              />
              <div className="write_bottom_div">
                <p>
                  <img
                    alt={isSecretReply ? "비밀댓글" : "비밀댓글 아님"}
                    src={isSecretReply ? SecretIcon : NotSecretIcon}
                    onClick={() => this.handleIsCommentSecret("isSecretReply")}
                    onKeyDown={() =>
                      this.handleIsCommentSecret("isSecretReply")
                    }
                  />
                  {isSecretReply ? "비밀댓글" : ""}
                </p>
                <button className={replyData ? "active" : ""}>확인</button>
              </div>
            </div>
          </div>
        </div>
      )
    );
  };

  setInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const {
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
                  >
                    <div className="comment_info">
                      <div
                        className="left_info"
                        style={
                          el.is_secret && el.comment.length === 0
                            ? { marginBottom: 0 }
                            : { marginBottom: 7 }
                        }
                      >
                        <p className="email">
                          {el.is_secret && el.comment.length === 0
                            ? "비밀 댓글입니다"
                            : el.email}
                        </p>
                        <p className="dot" />
                        <p className="date">{el.date}</p>
                        {el.is_secret && (
                          <img
                            className="secret_icon"
                            alt="비밀댓글"
                            src={SecretIcon}
                          />
                        )}
                        <button onClick={() => this.handleReplyingId(el.id)}>
                          <img alt="답글 달기" src={ReplyIcon} />
                          {replyingId === el.id ? "취소" : "댓글"}
                        </button>
                      </div>
                      {el.is_mine && (
                        <div className="right_buttons">
                          <button onClick={() => this.handleEditComment(el)}>
                            수정
                          </button>
                          <button>삭제</button>
                        </div>
                      )}
                    </div>

                    {/* 수정 상태로 변할 경우 */}
                    {this.renderEditOrComment(el.id, el.comment)}
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
                                    el2.is_secret && el2.comment.length === 0
                                      ? { marginBottom: 0 }
                                      : { marginBottom: 7 }
                                  }
                                >
                                  <p className="email">
                                    {el2.is_secret && el2.comment.length === 0
                                      ? "비밀 댓글입니다"
                                      : el2.email}
                                  </p>
                                  <p className="dot" />
                                  <p className="date">{el2.date}</p>
                                  {el2.is_secret && (
                                    <img
                                      className="secret_icon"
                                      alt="비밀댓글"
                                      src={SecretIcon}
                                    />
                                  )}
                                  <button
                                    onClick={() =>
                                      this.handleReplyingId(el2.id)
                                    }
                                  >
                                    <img alt="답글 달기" src={ReplyIcon} />
                                    {replyingId === el2.id ? "취소" : "댓글"}
                                  </button>
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
                              {this.renderEditOrComment(el2.id, el2.comment)}
                            </div>
                          </div>

                          {/* 대댓글에 댓글을 달 경우... */}
                          {this.renderReplyDiv(el2.id)}
                        </div>
                      ))}

                      {/* 댓글에 댓글을 달 경우... */}
                      {this.renderReplyDiv(el.id, true)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="comment_write_div">
            <textarea
              name="commentData"
              placeholder="댓글은 큰 힘이 됩니다."
              onChange={this.setInput}
            />
            <div className="write_bottom_div">
              <p>
                <img
                  alt={isSecretComment ? "비밀댓글" : "비밀댓글 아님"}
                  src={isSecretComment ? SecretIcon : NotSecretIcon}
                  onClick={() => this.handleIsCommentSecret("isSecretComment")}
                  onKeyDown={() =>
                    this.handleIsCommentSecret("isSecretComment")
                  }
                />
                {isSecretComment ? "비밀댓글" : ""}
              </p>
              <button className={commentData ? "active" : ""}>확인</button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default CommentSection;
