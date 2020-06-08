import Link from "next/link";
import Router, { withRouter } from "next/router";

import swal from "sweetalert";
import * as moment from "moment";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";
import ItemCount from "Components/Common/ItemCount/ItemCount";
import Pagination from "Components/Common/Pagination/Pagination";
import { numberFormat } from "Utils/Number";
import { getFetch, deleteFetch } from "Utils/GetFetch";
import { queryToObject, objectToQuerystring } from "Utils/QueryString";
import * as constants from "constants.js";

import Eye from "@Img/eye_icon.svg";
import "./post.scss";

class PostList extends React.Component {
  constructor(props) {
    super(props);

    const queryObj = queryToObject(props.router.asPath);

    this.state = {
      itemCount: 15,
      pageNum: 1,
      categoryId: Number(queryObj.category_id) || "",
      alignBy: queryObj.sorting_option || "new",
      searchType: queryObj.search_option || "",
      searchWord: queryObj.search ? decodeURIComponent(queryObj.search) : "",
      categoryList: [],
      postList: [],
    };
  }

  componentDidMount = () => {
    this.getPostList();

    // 카테고리 리스트
    getFetch(
      "/categories/posts/list/admin",
      { token: true },
      this.getCategoryListRes,
    );
  };

  getCategoryListRes = (res) => {
    if (res.category_list) {
      this.setState({
        categoryList: res.category_list,
      });
    }
  };

  // 포스트 리스트
  getPostList = () => {
    const {
      itemCount,
      pageNum,
      categoryId,
      searchType,
      searchWord,
      alignBy,
    } = this.state;
    const params = {};

    if (!searchType && searchWord) {
      swal({
        text: "검색 기준을 선택해주세요.",
        button: "확인",
      });
    } else if (searchType && !searchWord) {
      swal({
        text: "검색어를 입력해주세요.",
        button: "확인",
      });
    } else {
      itemCount !== 15 && (params.item_count = itemCount);
      pageNum !== 1 && (params.page_num = pageNum);
      categoryId && (params.category_id = categoryId);
      searchType && (params.search_option = searchType);
      searchWord && (params.search = searchWord);
      alignBy !== "new" && (params.sorting_option = alignBy);

      Router.push(`/admin/post${objectToQuerystring(params)}`);

      getFetch(
        `/posts/list/admin${objectToQuerystring(params)}`,
        { token: true },
        this.getPostListRes,
      );
    }
  };

  getPostListRes = (res) => {
    if (res.message === "CATEGORY_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 카테고리입니다.",
        button: "확인",
      });
    } else if (res.message === "WRONG_SEARCH_OPTION") {
      swal({
        text: "검색 옵션을 잘못 입력하셨습니다.",
        button: "확인",
      });
    } else if (res.message === "WRONG_SORTING_OPTION") {
      swal({
        text: "정렬 옵션을 선택해주세요.",
        button: "확인",
      });
    } else if (res.post_list) {
      this.setState({
        postList: res.post_list,
        totalCount: res.total_count,
      });
    }
  };

  handleItemCount = (num) => {
    this.setState(
      {
        itemCount: num,
        pageNum: 1,
      },
      () => this.getPostList(),
    );
  };

  setInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleReset = () => {
    this.setState(
      {
        pageNum: 1,
        itemCount: 15,
        categoryId: "",
        searchType: "",
        searchWord: "",
        alignBy: "new",
      },
      () => this.getPostList(),
    );
  };

  handleSearch = () => {
    this.setState(
      {
        pageNum: 1,
      },
      () => this.getPostList(),
    );
  };

  enterPressed = (e) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      this.getPostList();
    }
  };

  linkPage = (num) => {
    this.setState(
      {
        pageNum: num,
      },
      () => this.getPostList(),
    );
  };

  // 포스트 삭제
  deletePost = (postId) => {
    swal({
      text: "해당 포스트를 삭제하시겠습니까?",
      buttons: ["취소", "확인"],
    }).then((isTrue) => {
      if (isTrue) {
        deleteFetch(
          `/posts/admin`,
          JSON.stringify({ id: postId }),
          this.deletePostRes,
        );
      }
    });
  };

  deletePostRes = (res) => {
    if (res.message === "POST_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 포스트입니다.",
        button: "확인",
      }).then(() => this.getPostList());
    } else if (res.message === "DELETE_SUCCESS") {
      this.getPostList();
    }
  };

  render() {
    const {
      categoryId,
      categoryList,
      alignBy,
      searchType,
      searchWord,
      postList,
      totalCount,
      itemCount,
      pageNum,
    } = this.state;

    return (
      <AdminLayout>
        <div className="admin_section admin_post_list_wrapper">
          <div className="admin_content_title">포스트 관리</div>
          <div className="admin_content">
            {/* 컴플리 */}
            <div className="admin_complicated_search_wrapper">
              <div className="complicated_info_wrap">
                <div className="complicated_info_div">
                  <p>
                    <em>총 포스트 수 : </em>
                    {numberFormat(totalCount)}
                  </p>
                </div>
                <Link href="/admin/post/add">
                  <button className="admin_border_blue_btn">포스트 등록</button>
                </Link>
              </div>
              <div className="complicated_search_div">
                <div className="complicated_search_row">
                  {/* 카테고리 */}
                  <span className="search_label">카테고리 : </span>
                  <select
                    name="categoryId"
                    className="search_custom_input"
                    onChange={this.setInput}
                    value={categoryId || ""}
                    style={{ marginRight: 30 }}
                  >
                    <option value="">선택해주세요</option>
                    {categoryList.map((el, idx) => (
                      <option key={idx} value={el.id}>
                        {el.category_name}
                      </option>
                    ))}
                  </select>
                  {/* 정렬 기준 */}
                  <span className="search_label">정렬 : </span>
                  <select
                    name="alignBy"
                    className="search_custom_input"
                    onChange={this.setInput}
                    value={alignBy || ""}
                    style={{ marginRight: 30 }}
                  >
                    <option value="new">최신 순</option>
                    <option value="old">오래된 순</option>
                    <option value="count">조회수 순</option>
                  </select>
                  {/* 검색 기준 */}
                  <span className="search_label">검색 기준 : </span>
                  <select
                    name="searchType"
                    className="search_custom_input"
                    onChange={this.setInput}
                    value={searchType || ""}
                    style={{ marginRight: 10 }}
                  >
                    <option value="">선택해주세요</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="title_content">제목+내용</option>
                  </select>
                  <input
                    name="searchWord"
                    type="text"
                    className="search_custom_input"
                    style={{ width: 150, marginRight: 30 }}
                    onChange={this.setInput}
                    onKeyPress={(e) => this.enterPressed(e)}
                    value={searchWord || ""}
                  />
                  {/* 체크박스 */}
                  {/* <div className="search_custom_checkbox_div">
                    <div
                      className={`search_custom_checkbox ${
                        this.state.isMain ? "true" : ""
                      }`}
                      onClick={() => this.handleCheckbox("isMain")}
                      onKeyDown={() => this.handleCheckbox("isMain")}
                    />
                    <p>메인 포스트만</p>
                  </div> */}
                  <button onClick={this.handleSearch}>검색</button>
                </div>
              </div>
              <div className="complicated_search_btn_div">
                <div>
                  <button
                    className="admin_blue_btn"
                    onClick={this.handleReset}
                    style={{ marginRight: 10 }}
                  >
                    전체목록
                  </button>
                </div>
                <ItemCount
                  itemCount={this.state.itemCount}
                  handleItemCount={this.handleItemCount}
                />
              </div>
            </div>

            <div className="post_unit_wrap">
              {postList.map((el, idx) => (
                <div key={idx} className="post_unit">
                  <Link href={`/admin/post/edit?id=${el.post_id}`}>
                    <div
                      className="left_div"
                      style={{
                        backgroundImage: `url(${constants.URL_BACK}/files?guid=${el.main_image_guid}&width=400)`,
                      }}
                    />
                  </Link>
                  <div className="right_div">
                    <div className="category_div">
                      <div className="button_div">
                        {el.is_main && (
                          <p className="category main_post">메인 포스트</p>
                        )}
                        <p
                          className={`category category_${el.category_number}`}
                        >
                          {el.category_name}
                        </p>
                      </div>
                      <p className="hits">
                        <img alt="조회수" src={Eye} />
                        <span>{el.view_count}</span>
                      </p>
                    </div>
                    <Link href={`/admin/post/edit?id=${el.post_id}`}>
                      <div className="title_description_div">
                        <h3 className="title">{el.title}</h3>
                        <p className="description">{el.description}</p>
                      </div>
                    </Link>
                    <div className="bottom_div">
                      <p className="date">
                        {moment(el.created_at).format("YYYY년 M월 D일")}
                      </p>
                      <u
                        className="delete_btn"
                        onClick={() => this.deletePost(el.post_id)}
                        onKeyDown={() => this.deletePost(el.post_id)}
                      >
                        삭제
                      </u>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              activePage={parseInt(pageNum)}
              itemsCountPerPage={itemCount} // itemCount를 Pagination 컴포넌트에 props로 넘겨줍니다.
              totalItemsCount={totalCount}
              change={this.linkPage}
            />
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default withRouter(PostList);
