import Link from "next/link";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";
import ItemCount from "Components/Common/ItemCount/ItemCount";
import Pagination from "Components/Common/Pagination/Pagination";
import { numberFormat } from "Utils/Number";

import Eye from "@Img/eye_icon.png";
import "./post.scss";

const des =
  "어쩌구 저쩌구 샘플데이터 description 포스트설명 우갸갸갸 집보내주세요 테스팅 테스팅 네네 알겠습니다~~~ 어쩌구 저쩌구 샘플데이터 description 포스트설명 우갸갸갸 집보내주세요 테스팅 테스팅 네네 알겠습니다~~~ 어쩌구 저쩌구 샘플데이터 description 포스트설명 우갸갸갸 집보내주세요 테스팅 테스팅 네네 알겠습니다~~~ 어쩌구 저쩌구 샘플데이터 description 포스트설명 우갸갸갸 집보내주세요 테스팅 테스팅 네네 알겠습니다~~~ 어쩌구 저쩌구 샘플데이터 description 포스트설명 우갸갸갸 집보내주세요 테스팅 테스팅 네네 알겠습니다~~~";

class PostList extends React.Component {
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
    postList: [
      {
        id: 1,
        title: "첫번째 포스트 제목",
        description: `첫번째 포스트 설명${des}`,
        category: "데일리언",
        hits: 139,
        date: "2020-01-18",
      },
      {
        id: 2,
        title: "두번째 포스트 제목",
        description: `두번째 포스트 설명${des}`,
        category: "개발",
        hits: 150,
        date: "2020-01-18",
      },
      {
        id: 3,
        title: "세번째 포스트 제목",
        description: `세번째 포스트 설명${des}`,
        category: "꿀팁",
        hits: 70,
        date: "2020-01-18",
      },
      {
        id: 4,
        title: "네번째 포스트 제목",
        description: `네번째 포스트 설명${des}`,
        category: "정보",
        hits: 110,
        date: "2020-01-18",
      },
    ],
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

            <div className="post_unit_wrap">
              {postList.map((el, idx) => (
                <div key={idx} className="post_unit">
                  <Link href={`/admin/post/edit?id=${el.id}`}>
                    <div className="left_div" />
                  </Link>
                  <div className="right_div">
                    <div className="category_div">
                      <p className={`category category_${idx + 1}`}>
                        {el.category}
                      </p>
                      <p className="hits">
                        <img alt="조회수" src={Eye} />
                        <span>{el.hits}</span>
                      </p>
                    </div>
                    <Link href={`/admin/post/edit?id=${el.id}`}>
                      <div className="title_description_div">
                        <h3 className="title">{el.title}</h3>
                        <p className="description">{el.description}</p>
                      </div>
                    </Link>
                    <div className="bottom_div">
                      <p className="date">{el.date}</p>
                      <u className="delete_btn">삭제</u>
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

export default PostList;
