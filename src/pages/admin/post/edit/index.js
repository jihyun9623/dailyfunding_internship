import dynamic from "next/dynamic";
import Router, { withRouter } from "next/router";

import swal from "sweetalert";
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

  getCategoryListRes = (res) => {
    if (res.category_list) {
      this.setState({
        categoryList: res.category_list,
      });
    }
  };

  getPostInfoRes = (res) => {
    if (res.message === "POST_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 포스트입니다.",
        button: "확인",
      }).then(() => this.linkBack());
    } else if (res.post_info) {
      const info = res.post_info;

      this.setState({
        categoryId: info.category_id,
        mainImageGuid: info.main_image_guid,
        title: info.title,
        subtitle: info.subtitle,
        description: info.description,
        content: info.content,
        isMain: info.is_main,
        postHidden: info.is_hidden,
        subtitleHidden: info.author_hidden,
        createdAtHidden: info.created_at_hidden,
        commentHidden: !info.allow_comment,
      });
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
    const { parentsGuid } = this.state;
    const photoFormData = new FormData();

    this.setState({ tempPhoto: e.target.files[0] }, () => {
      photoFormData.append("upload", this.state.tempPhoto);
      photoFormData.append("is_secret", "False");
      if (parentsGuid) {
        photoFormData.append("parents_guid", parentsGuid);
      }

      postFetch("/files", { token: true }, photoFormData, this.uploadImageRes);
    });
  };

  uploadImageRes = (response) => {
    if (response.message === "SAVE_SUCCESS") {
      this.setState({
        mainImageGuid: response.guid,
        parentsGuid: response.parents_guid,
      });
    } else {
      swal("", "이미지 등록에 실패했습니다.", "error");
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

  handleSubmit = () => {
    const {
      postId,
      parentsGuid,
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
      parents_guid: parentsGuid,
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

    postFetch(
      "/posts/update/admin",
      { token: data },
      JSON.stringify(data),
      this.handleSubmitRes,
    );
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
              <button className="admin_blue_btn" onClick={this.handleSubmit}>
                출간하기
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default withRouter(PostAdd);
