import Link from "next/link";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";
import ItemCount from "Components/Common/ItemCount/ItemCount";
import Pagination from "Components/Common/Pagination/Pagination";
import { numberFormat } from "Utils/Number";

// import Eye from "@Img/eye_icon.png";
import "./category.scss";

class CategoryList extends React.Component {
  state = {
    itemCount: 20,
    pageNum: 1,
    category: "total",
    categoryList: [
      {
        text: "전체",
        value: "total",
      },
      {
        text: "데일리언",
        value: "dailian",
      },
      {
        text: "개발",
        value: "development",
      },
      {
        text: "꿀팁",
        value: "honeytip",
      },
      {
        text: "정보",
        value: "information",
      },
    ],
    alignBy: "newest",
    searchType: "title",
  };

  componentDidMount = () => {
    this.getPostList();
  };

  getPostList = () => {
    console.log(1);
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

  handleSearch = () => {
    this.setState(
      {
        pageNum: 1,
      },
      () => this.getPostList(),
    );
  };

  linkPage = (num) => {
    this.setState(
      {
        pageNum: num,
      },
      () => this.getPostList(),
    );
  };

  render() {
    const {
      category,
      categoryList,
      alignBy,
      searchType,
      searchWord,
      totalCount,
      itemCount,
      pageNum,
    } = this.state;

    return (
      <AdminLayout>
        <div className="admin_section admin_post_list_wrapper">
          <div className="admin_content_title">카테고리 관리</div>
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
              <form
                className="complicated_search_div"
                onSubmit={this.handleSearch}
              >
                <div className="complicated_search_row">
                  {/* 카테고리 */}
                  <span className="search_label">카테고리 : </span>
                  <select
                    name="category"
                    className="search_custom_input"
                    onChange={this.setInput}
                    value={category || ""}
                    style={{ marginRight: 30 }}
                  >
                    {categoryList.map((el, idx) => (
                      <option key={idx} value={el.value}>
                        {el.text}
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
                    <option value="newest">최신 순</option>
                    <option value="hits">조회수 순</option>
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
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="">제목+내용</option>
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
                        this.state.subscribeEmail ? "true" : ""
                      }`}
                      onClick={() => this.handleCheckbox("subscribeEmail")}
                      onKeyDown={() => this.handleCheckbox("subscribeEmail")}
                    />
                    <p>체크사항</p>
                  </div> */}
                  <input type="submit" value="검색" />
                </div>
              </form>
              <div className="complicated_search_btn_div">
                <div>
                  <button
                    className="admin_blue_btn"
                    onClick={this.handleUserAllList}
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

            <div className="post_unit_wrap" />

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

export default CategoryList;
