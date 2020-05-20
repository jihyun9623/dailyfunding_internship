import dynamic from "next/dynamic";
import { withRouter } from "next/router";

import swal from "sweetalert";
import { WithContext as ReactTags } from "react-tag-input";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";
// import { getFetch, postFetch } from "Utils/GetFetch";

import Arrow from "@Img/back_arrow.svg";
import "./add.scss";

// nextjs는 기본적으로 ssr을 지원하는데 ckeditor5가 window 객체를 무조건 필요로 하기때문에 에러가 난다.
// 때문에 ckeditor는 client에서만 렌더링되도록 수정.
const Editor = dynamic(() => import("Components/Common/Editor/Editor.js"), {
  ssr: false,
});

// tag 추가 컴포넌트 관련
const KeyCodes = {
  enter: 13,
};

const delimiters = [KeyCodes.enter];

class PostAdd extends React.Component {
  state = {
    data: "",
    tags: [],
    suggestions: [
      { id: "USA", text: "USA" },
      { id: "Germany", text: "Germany" },
      { id: "Austria", text: "Austria" },
      { id: "Costa Rica", text: "Costa Rica" },
      { id: "Sri Lanka", text: "Sri Lanka" },
      { id: "Thailand", text: "Thailand" },
    ],
  };

  componentDidMount = () => {};

  // 메인 이미지 등록
  fakeButtonClick = () => {
    document.getElementById("hiddenFileInput").click();
  };

  deleteMainImage = () => {
    // ---------------------------------------
    // 기존 이미지 삭제하는 로직 추가
    // ---------------------------------------
  };

  setImage = (e) => {
    this.setState({ tempPhoto: e.target.files[0] }, () => this.uploadImage());
  };

  uploadImage = () => {
    const photoFormData = new FormData();
    photoFormData.append("upload", this.state.tempPhoto);
    // photoFormData.append("group_id", 2);
    photoFormData.append("is_secret", "False");

    // postFetch("/files", { token: true }, photoFormData, this.uploadImageRes);
  };

  uploadImageRes = (response) => {
    if (response.message === "SAVE_SUCCESS") {
      this.setState({
        guid: response.guid,
      });
      swal("", "이미지가 등록되었습니다.", "success");
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

  handleTagAddition = (tag) => {
    this.setState((state) => ({ tags: [...state.tags, tag] }));
  };

  // 에디터 data 받아오는 함수
  getDataFromEditor = (data) => {
    this.setState({
      data,
    });
  };

  render() {
    const {
      category,
      title,
      description,
      guid,
      tags,
      suggestions,
    } = this.state;

    return (
      <AdminLayout>
        <div className="admin_section admin_post_add_wrapper">
          <div className="admin_content_title">포스트 등록</div>
          <div className="admin_content">
            <div className="post_info_div">
              {/* 메인이미지 등록 */}
              <div className="left_div">
                <div className="row">
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
                  />
                  <div
                    className="image_thumbnail"
                    style={
                      {
                        // backgroundImage:
                        //   guid &&
                        //   `url(${constants.URL_BACK}/files?guid=${this.state.guid})`,
                      }
                    }
                  >
                    {!guid && (
                      <button onClick={this.fakeButtonClick}>
                        이미지 업로드
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="right_div">
                <div className="two_section">
                  <div className="row">
                    <p className="label">카테고리</p>
                    <select
                      className="input_default"
                      name="category"
                      onChange={this.setInput}
                      defaultValue={category || ""}
                    >
                      <option value="">선택해주세요.</option>
                    </select>
                  </div>
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
                </div>
                <div className="row">
                  <p className="label">소개글</p>
                  <textarea
                    name="description"
                    placeholder="포스트를 짧게 소개해주세요."
                    className="textarea_default"
                    onChange={this.setInput}
                    defaultValue={description || ""}
                  />
                  <p className="charactor_limit">0/150</p>
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
                </p> */}
                <ReactTags
                  tags={tags}
                  suggestions={suggestions}
                  handleDelete={this.handleTagDelete}
                  handleAddition={this.handleTagAddition}
                  allowDragDrop={false}
                  delimiters={delimiters}
                  placeholder="태그를 입력하세요."
                  minQueryLength={1}
                />
              </div>
            </div>

            {/* 에디터 */}
            <Editor getData={this.getDataFromEditor} />

            <div className="confirm_btn_div">
              <button className="admin_white_btn">
                <img alt="뒤로" src={Arrow} />
                <span>뒤로</span>
              </button>
              <button className="admin_blue_btn">출간하기</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default withRouter(PostAdd);
