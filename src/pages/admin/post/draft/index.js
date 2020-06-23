import Link from "next/link";
import Head from "next/head";
import { withRouter } from "next/router";

import swal from "sweetalert";
import * as moment from "moment";
import "moment-timezone";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";
import Pagination from "Components/Common/Pagination/Pagination";
import { getFetch, deleteFetch } from "Utils/GetFetch";
import { objectToQuerystring } from "Utils/QueryString";
import * as constants from "constants.js";

// import "./draft.scss";

class DraftList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemCount: 15,
      pageNum: 1,
      postList: [],
    };
  }

  componentDidMount = () => {
    this.getPostList();
  };

  // 포스트 리스트
  getPostList = () => {
    const { itemCount, pageNum } = this.state;
    const params = {};

    params.is_drafted = true;
    itemCount !== 15 && (params.item_count = itemCount);
    pageNum !== 1 && (params.page_num = pageNum);

    getFetch(
      `/posts/list/admin${objectToQuerystring(params)}`,
      { token: true },
      this.getPostListRes,
    );
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

  linkPage = (num) => {
    this.setState(
      {
        pageNum: num,
      },
      () => this.getPostList(),
    );
  };

  // 미리보기 창 열기
  openPreview = (draftId) => {
    window.open(`/admin/post/draft/preview?draft_id=${draftId}`);
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
    const { postList, totalCount, itemCount, pageNum } = this.state;

    return (
      <AdminLayout>
        <div className="admin_section admin_post_list_wrapper">
          <Head>
            <title>임시 글 목록 - 데일리 인사이트</title>
            <meta id="og-type" property="og:type" content="website" />
            <meta
              id="og-title"
              property="og:title"
              content="임시 글 목록 - 데일리 인사이트"
            />
            <meta
              property="og:description"
              content="임시 글 목록 - 데일리 인사이트"
            />
            <meta property="og:image" content="Img/sns_logo.png" />
          </Head>
          <div className="admin_content_title">임시 글 목록</div>
          <div className="admin_content">
            <div className="post_unit_wrap" style={{ marginTop: 0 }}>
              {postList.map((el, idx) => (
                <div key={idx} className="post_unit">
                  <Link href={`/admin/post/add?draft_id=${el.post_id}`}>
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
                      <u
                        className="delete_btn"
                        onClick={() => this.openPreview(el.post_id)}
                        onKeyDown={() => this.openPreview(el.post_id)}
                      >
                        미리보기
                      </u>
                    </div>
                    <Link href={`/admin/post/add?draft_id=${el.post_id}`}>
                      <div className="title_description_div">
                        <h3 className="title">{el.title}</h3>
                        <p className="description">{el.description}</p>
                      </div>
                    </Link>
                    <div className="bottom_div">
                      <p className="date">
                        {moment(el.created_at)
                          .tz(moment.tz.guess())
                          .format("YYYY년 M월 D일")}
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

export default withRouter(DraftList);
