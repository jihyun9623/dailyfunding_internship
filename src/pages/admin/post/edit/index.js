import dynamic from "next/dynamic";
import Head from "next/head";
import Router, { withRouter } from "next/router";

import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
// 태그 관련 라이브러리
// import { WithContext as ReactTags } from "react-tag-input";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";
import { getFetch, postFetch, deleteFetch } from "Utils/GetFetch";
import { queryToObject } from "Utils/QueryString";
import * as constants from "constants.js";

import Arrow from "@Img/back_arrow.svg";
import "../add/add.scss";

// nextjs는 기본적으로 ssr을 지원하는데 ckeditor5가 window 객체를 무조건 필요로 하기때문에 에러가 난다.
// 때문에 ckeditor는 client에서만 렌더링되도록 수정.
const Editor = dynamic(() => import("Components/Common/Editor/Editor.js"), {
  ssr: false,
});

// 태그 관련
// const KeyCodes = {
//   enter: 13,
// };
// const delimiters = [KeyCodes.enter];

let autosaveTimer;

class PostAdd extends React.Component {
  state = {
    postId: Number(queryToObject(this.props.router.asPath).id),
    description: "",
    content: "",
    categoryList: [],
    postHidden: false,
    commentHidden: false,
    subtitleHidden: false,
    createdAtHidden: false,
    willDeleteGuid: [],
    // 태그 관련
    // tags: [],
    // suggestions: [
    //   { id: "USA", text: "USA" },
    //   { id: "Austria", text: "Austria" },
    // ],
  };

  componentDidMount = () => {
    // 카테고리 리스트
    getFetch(
      "/categories/posts/list/admin",
      { token: true },
      this.getCategoryListRes,
    );

    // 포스트 정보 받아오기
    getFetch(
      `/posts/admin?id=${this.state.postId}`,
      { token: true },
      this.getPostInfoRes,
    );
  };

  componentDidUpdate = () => {
    // content 가 한 번 수정되고 나면 60초마다 자동 임시저장
    if (this.state.content !== this.state.originalContent && !autosaveTimer) {
      autosaveTimer = window.setInterval(() => this.handleSubmit(true), 60000);
    }
  };

  componentWillUnmount = () => {
    window.clearInterval(autosaveTimer);
  };

  getCategoryListRes = (res) => {
    if (res.category_list) {
      this.setState({
        categoryList: res.category_list,
      });
    }
  };

  getPostInfoRes = (res) => {
    if (
      res.message === "POST_DOES_NOT_EXIST" ||
      res.message === "TEMP_POST_DOES_NOT_EXIST"
    ) {
      swal({
        text: "존재하지 않는 포스트입니다.",
        button: "확인",
      }).then(() => this.linkBack());
    } else if (res.post_info || res.temp_post_info) {
      let info;
      res.post_info && (info = res.post_info);
      res.temp_post_info && (info = res.temp_post_info);

      this.setState(
        {
          // 현재의 게시글을 임시저장한 이력이 있을 경우 전달되는 아이디
          tempId: info.temp_id,
          categoryId: info.category_id,
          mainImageGuid: info.main_image_guid,
          title: info.title,
          subtitle: info.subtitle,
          description: info.description,
          // 주기적으로 임시저장을 하기 위해 비교대상으로 기존 contents 를 저장
          originalContent: info.content,
          content: info.content,
          isMain: info.is_main,
          postHidden: info.is_hidden,
          subtitleHidden: info.author_hidden,
          createdAtHidden: info.created_at_hidden,
          commentHidden: !info.allow_comment,
        },
        () => {
          if (this.state.tempId) {
            // 현재 게시글에 임시저장 이력이 있을 경우
            // 임시저장 내용을 불러올지 alert
            swal({
              text: "임시저장된 글이 있습니다. 불러오시겠습니까?",
              buttons: ["아니오", "예"],
            }).then((isTrue) => {
              if (isTrue) {
                getFetch(
                  `/posts/temp/admin?id=${this.state.tempId}`,
                  { token: true },
                  this.getPostInfoRes,
                );
              }
            });
          }
        },
      );
    }
  };

  // 메인 이미지 등록
  fakeButtonClick = () => {
    document.getElementById("hiddenFileInput").click();
  };

  turnValueNull = (e) => {
    e.target.value = null;
  };

  deleteMainImage = () => {
    // 기존 이미지를 '삭제 예정 리스트'에 추가하고 mainImageGuid 에서 지워버리기
    // 삭제 예정 리스트는 최종 submit 시 삭제
    const { willDeleteGuid, mainImageGuid } = this.state;

    willDeleteGuid.push(mainImageGuid);

    this.setState({
      mainImageGuid: undefined,
      willDeleteGuid,
    });
  };

  setImage = (e) => {
    const photoFormData = new FormData();

    this.setState({ tempPhoto: e.target.files[0] }, () => {
      photoFormData.append("upload", this.state.tempPhoto);
      photoFormData.append("is_secret", "False");

      postFetch("/files", { token: true }, photoFormData, this.uploadImageRes);
    });
  };

  uploadImageRes = (response) => {
    if (response.message === "SAVE_SUCCESS") {
      this.setState({
        mainImageGuid: response.guid,
      });
    } else if (response.message === "FILE_SIZE_MUST_BE_UNDER_10MB") {
      swal({
        text: "10MB 이하의 이미지만 업로드 가능합니다.",
        button: "확인",
      });
    } else {
      swal({
        text: "이미지 등록에 실패했습니다.",
        button: "확인",
      });
    }
  };

  // 태그 관련 함수들
  handleTagDelete = (i) => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  };

  // 태그 추가하는 로직
  // handleTagAddition = (tag) => {
  //   this.setState((prevState) => ({ tags: [...prevState.tags, tag] }));
  // };

  // 에디터 content 받아오는 함수
  getDataFromEditor = (content) => {
    this.setState({
      content,
    });
  };

  setInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // 체크박스 핸들링
  handleCheck = (str) => {
    this.setState((prevState) => ({
      [str]: !prevState[str],
    }));
  };

  linkBack = () => {
    if (window.history.length !== 1) {
      Router.back();
    } else {
      // 히스토리가 없을 때에는 포스트 관리자 페이지로 리다이렉트
      Router.push("/admin/post");
    }
  };

  // 임시저장, 출간하기 동시처리
  handleSubmit = (draft) => {
    const {
      postId,
      mainImageGuid,
      categoryId,
      title,
      subtitle,
      description,
      isMain,
      postHidden,
      commentHidden,
      subtitleHidden,
      createdAtHidden,
      content,
    } = this.state;

    const data = {
      id: postId,
      main_image_guid: mainImageGuid,
      category_id: categoryId,
      title,
      subtitle,
      description,
      is_main: isMain,
      is_hidden: postHidden,
      allow_comment: !commentHidden,
      author_hidden: subtitleHidden,
      created_at_hidden: createdAtHidden,
      content,
    };

    if (draft) {
      // 임시저장일 때
      postFetch(
        "/posts/temp/admin",
        { token: true },
        JSON.stringify(data),
        this.handleDraftSaveRes,
      );
    } else {
      // 출간일 때
      swal({
        text: "정식 출간하시겠습니까?",
        buttons: ["취소", "확인"],
      }).then((isTrue) => {
        if (isTrue) {
          postFetch(
            "/posts/update/admin",
            { token: true },
            JSON.stringify(data),
            this.handleSubmitRes,
          );
        }
      });
    }
  };

  handleSubmitRes = (res) => {
    if (res.message === "POST_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 포스트입니다.",
        button: "확인",
      }).then(() => this.linkBack());
    } else if (res.message === "CATEGORY_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 카테고리입니다.",
        button: "확인",
      }).then(() => this.linkBack());
    } else if (res.message && res.message.indexOf("ERROR_IS") !== -1) {
      swal({
        text: "필수 항목이 누락되었습니다.",
        button: "확인",
      });
    } else if (res.message === "UPDATE_SUCCESS") {
      // 삭제 예정 파일 리스트 삭제
      const { willDeleteGuid } = this.state;

      if (willDeleteGuid.length !== 0) {
        for (let i = 0; i < willDeleteGuid.length; i++) {
          if (i + 1 !== willDeleteGuid.length) {
            deleteFetch(
              "/files",
              JSON.stringify({ guid: willDeleteGuid[i] }),
              this.handleDeleteGuidRes,
            );
          } else {
            deleteFetch(
              "/files",
              JSON.stringify({ guid: willDeleteGuid[i] }),
              (res2) => this.handleDeleteGuidRes(res2, "goBack"),
            );
          }
        }
      } else {
        this.linkBack();
      }
    } else {
      swal({
        text: "알 수 없는 오류로 포스트 저장에 실패했습니다.",
        button: "확인",
      });
    }
  };

  handleDeleteGuidRes = (res, goBack) => {
    if (goBack) {
      Router.push("/admin/post");
    }
  };

  // 임시저장
  handleDraftSaveRes = (res) => {
    if (res.message && res.message.indexOf("ERROR_IS") !== -1) {
      toast.error("필수 항목이 누락되었습니다.");
    } else if (res.message === "TEMPORARY_SAVE_SUCCESS") {
      toast.info("게시글이 임시저장되었습니다.");
    } else {
      toast.error("알 수 없는 오류로 게시글을 임시저장하는데 실패했습니다.");
    }
  };

  render() {
    const {
      categoryList,
      categoryId,
      title,
      subtitle,
      description,
      content,
      mainImageGuid,
      isMain,
      postHidden,
      commentHidden,
      subtitleHidden,
      createdAtHidden,
      // tags,
      // suggestions,
    } = this.state;

    return (
      <AdminLayout>
        <div className="admin_section admin_post_add_wrapper">
          <Head>
            <title>포스트 편집 - 데일리 인사이트</title>
            <meta id="og-type" property="og:type" content="website" />
            <meta
              id="og-title"
              property="og:title"
              content="포스트 편집 - 데일리 인사이트"
            />
            <meta
              property="og:description"
              content="포스트 편집 - 데일리 인사이트"
            />
            <meta property="og:image" content="Img/sns_logo.png" />
          </Head>

          <ToastContainer pauseOnFocusLoss={false} />

          <div className="admin_content_title">포스트 편집</div>
          <div className="admin_content">
            <div className="post_info_div">
              {/* 메인이미지 등록 */}
              <div className="left_div">
                <div className="row" style={{ marginBottom: 15 }}>
                  <p className="label">
                    <span>메인이미지 등록</span>
                    <u
                      onClick={this.deleteMainImage}
                      onKeyDown={this.deleteMainImage}
                    >
                      삭제
                    </u>
                  </p>
                  <input
                    id="hiddenFileInput"
                    type="file"
                    className="input_default custom_file_upload"
                    onChange={this.setImage}
                    onClick={this.turnValueNull}
                  />
                  <div
                    className={`image_thumbnail ${
                      mainImageGuid ? "there_is_image" : ""
                    }`}
                    style={
                      mainImageGuid
                        ? {
                            backgroundImage: `url(${constants.URL_BACK}/files?guid=${this.state.mainImageGuid}&width=400)`,
                          }
                        : { color: "white" }
                    }
                  >
                    {!mainImageGuid && (
                      <button onClick={this.fakeButtonClick}>
                        이미지 업로드
                      </button>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="textarea_wrap">
                    <textarea
                      name="description"
                      placeholder="포스트를 짧게 소개해주세요."
                      maxLength="150"
                      onChange={this.setInput}
                      defaultValue={description || ""}
                    />
                  </div>
                  <p className="charactor_limit">{description.length}/150</p>
                </div>
              </div>

              <div className="right_div">
                <div className="row title_row">
                  <p className="label">제목</p>
                  <input
                    type="text"
                    name="title"
                    className="input_default"
                    onChange={this.setInput}
                    defaultValue={title || ""}
                  />
                </div>
                <div className="two_section">
                  <div className="row">
                    <p className="label">카테고리</p>
                    <select
                      className="input_default"
                      name="categoryId"
                      onChange={this.setInput}
                      value={categoryId || ""}
                    >
                      <option value="">선택해주세요.</option>
                      {categoryList.map((el, idx) => (
                        <option key={idx} value={el.id}>
                          {el.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row title_row">
                    <p className="label">부제</p>
                    <input
                      type="text"
                      name="subtitle"
                      className="input_default"
                      placeholder="작성자, 짧은 부제목 등을 입력해주세요."
                      onChange={this.setInput}
                      value={subtitle || ""}
                    />
                  </div>
                </div>
                <div className="row">
                  <p className="label">포스트 설정</p>
                  <div className="post_checkbox_wrap">
                    <div
                      className="post_checkbox_div"
                      onClick={() => this.handleCheck("isMain")}
                      onKeyDown={() => this.handleCheck("isMain")}
                    >
                      <div className={`post_check ${isMain ? "active" : ""}`} />
                      <p>메인 포스트로 설정 (상단 노출)</p>
                    </div>

                    <div
                      className="post_checkbox_div"
                      onClick={() => this.handleCheck("postHidden")}
                      onKeyDown={() => this.handleCheck("postHidden")}
                    >
                      <div
                        className={`post_check ${postHidden ? "active" : ""}`}
                      />
                      <p>포스팅 숨김</p>
                    </div>

                    <div
                      className="post_checkbox_div"
                      onClick={() => this.handleCheck("commentHidden")}
                      onKeyDown={() => this.handleCheck("commentHidden")}
                    >
                      <div
                        className={`post_check ${
                          commentHidden ? "active" : ""
                        }`}
                      />
                      <p>댓글창 숨김</p>
                    </div>

                    <div
                      className="post_checkbox_div"
                      onClick={() => this.handleCheck("subtitleHidden")}
                      onKeyDown={() => this.handleCheck("subtitleHidden")}
                    >
                      <div
                        className={`post_check ${
                          subtitleHidden ? "active" : ""
                        }`}
                      />
                      <p>부제 숨김</p>
                    </div>

                    <div
                      className="post_checkbox_div"
                      onClick={() => this.handleCheck("createdAtHidden")}
                      onKeyDown={() => this.handleCheck("createdAtHidden")}
                    >
                      <div
                        className={`post_check ${
                          createdAtHidden ? "active" : ""
                        }`}
                      />
                      <p>생성일 숨김</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 태그 */}
            <div className="divide_line" />
            <div className="post_info_div">
              <div className="row">
                {/* <p className="label">
                  <span>태그</span>
                  <span className="info">
                    (엔터 키를 이용해 태그를 등록할 수 있습니다.)
                  </span>
                </p>
                <ReactTags
                  tags={tags}
                  suggestions={suggestions}
                  handleDelete={this.handleTagDelete}
                  handleAddition={this.handleTagAddition}
                  allowDragDrop={false}
                  delimiters={delimiters}
                  placeholder="태그를 입력하세요."
                  minQueryLength={1}
                /> */}
              </div>
            </div>

            {/* 에디터 */}
            <Editor getData={this.getDataFromEditor} content={content} />

            <div className="confirm_btn_div">
              <button className="admin_white_btn" onClick={this.linkBack}>
                <img alt="뒤로" src={Arrow} />
                <span>뒤로</span>
              </button>
              <div>
                <button
                  className="admin_light_grey_btn"
                  onClick={() => this.handleSubmit(true)}
                >
                  임시저장
                </button>
                <button
                  className="admin_blue_btn"
                  onClick={() => this.handleSubmit(false)}
                >
                  출간하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default withRouter(PostAdd);
