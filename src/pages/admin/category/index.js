// import Link from "next/link";

import swal from "sweetalert";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";
import { getFetch, postFetch, deleteFetch } from "Utils/GetFetch";

import xButton from "@Img/red_x_btn.svg";
import "./category.scss";

class CategoryList extends React.Component {
  state = {
    categoryList: [],
    newItem: {
      category_name: "",
      url_name: "",
      sorting_number: 1,
    },
  };

  componentDidMount = () => {
    this.sortSection = React.createRef();
    document.addEventListener("mousedown", this.handleClickOutside);

    this.getCategoryList();
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  // 카테고리 리스트 받아오기
  getCategoryList = () => {
    getFetch(
      "/categories/posts/list/admin",
      { token: true },
      this.getCategoryListRes,
    );
  };

  getCategoryListRes = (res) => {
    if (res.message && res.message.indexOf("ERROR_IS") !== -1) {
      swal({
        text: "카테고리 정보를 받아오는 데 실패했습니다.",
        button: "확인",
      });
    } else {
      this.setState({
        categoryList: res.category_list,
      });
    }
  };

  // reorder 내부의 input 편집
  setInput = (e, idx, key) => {
    const { categoryList } = this.state;

    categoryList[idx][key] = e.target.value;

    this.setState({
      categoryList,
    });
  };

  // 신규 카테고리 추가 내부의 input 편집
  setNewInput = (e, key) => {
    const { newItem } = this.state;

    newItem[key] = e.target.value;

    this.setState({
      newItem,
    });
  };

  // 등록
  addNewItem = () => {
    const { categoryList, newItem } = this.state;

    categoryList.push(newItem);

    this.setState({
      categoryList,
      newItem: {
        category_name: "",
        1: 1,
        url_name: "",
        sorting_number: 1,
      },
    });
  };

  // 특정 파트 바깥부분 클릭 감지
  handleClickOutside = (event) => {
    if (
      this.sortSection.current &&
      !this.sortSection.current.contains(event.target)
    ) {
      this.setState({
        selectedCategory: undefined,
      });
    }
  };

  // 카테고리 선택
  selectCategory = (idx) => {
    this.setState({
      selectedCategory: idx,
    });
  };

  // 위로, 아래로 버튼을 통해 카테고리 순서 변경
  handleReorder = (type) => {
    const { selectedCategory, categoryList } = this.state;

    // 위로 올리기
    if (type === "up" && selectedCategory !== 0) {
      const editItem = categoryList[selectedCategory];
      categoryList.splice(selectedCategory, 1);
      categoryList.splice(selectedCategory - 1, 0, editItem);

      this.setState({
        categoryList,
        selectedCategory: selectedCategory - 1,
      });
    }

    // 아래로 내리기
    if (type === "down" && selectedCategory !== categoryList.length - 1) {
      const editItem = categoryList[selectedCategory];
      categoryList.splice(selectedCategory, 1);
      categoryList.splice(selectedCategory + 1, 0, editItem);

      this.setState({
        categoryList,
        selectedCategory: selectedCategory + 1,
      });
    }
  };

  // 카테고리 삭제
  deleteCategory = (el, idx) => {
    // el.id 가 있을 때 (실제 존재하는 카테고리)와 없을 때 (신규로 추가한 카테고리일 때)로 분기
    swal({
      text: el.id
        ? `해당 동작은 되돌릴 수 없습니다. "${el.category_name}" 카테고리를 삭제하시겠습니까?`
        : "삭제하시겠습니까?",
      buttons: ["취소", "확인"],
    }).then((isTrue) => {
      if (isTrue) {
        deleteFetch(
          "/categories/posts/admin",
          JSON.stringify({ id: el.id }),
          (res) => this.deleteCategoryRes(res, el.id, idx),
        );
      }
    });
  };

  deleteCategoryRes = (res, id, idx) => {
    if (res.message === "CATEGORY_DOES_NOT_EXIST") {
      swal({
        text: "존재하지 않는 카테고리입니다.",
        button: "확인",
      }).then(() => this.getCategoryList());
    } else if (res.message && res.message.indexOf("ERROR_IS") !== -1) {
      swal({
        text: id ? "필수 정보가 누락되었습니다." : "삭제되었습니다.",
        button: "확인",
      }).then(() => {
        if (id) {
          // 기존에 존재하던 카테고리를 삭제 시도한 경우
          this.getCategoryList();
        } else {
          // 신규로 추가했던 카테고리를 삭제한 경우
          const { categoryList } = this.state;
          categoryList.splice(idx, 1);

          this.setState({
            categoryList,
          });
        }
      });
    } else if (res.message === "DELETE_SUCCESS") {
      swal({
        text: "삭제되었습니다.",
        button: "확인",
      }).then(() => this.getCategoryList());
    }
  };

  // 수정 완료
  handleSubmit = () => {
    const { categoryList } = this.state;

    for (let i = 0; i < categoryList.length; i++) {
      categoryList[i].sorting_number = i + 1;
    }

    this.setState(
      {
        categoryList,
      },
      () =>
        postFetch(
          "/categories/posts/update/bulk/admin",
          { token: true },
          JSON.stringify(this.state.categoryList),
          this.handleSubmitRes,
        ),
    );
  };

  handleSubmitRes = (res) => {
    if (res.message === "INTEGRITY_ERROR") {
      swal({
        text: "중복된 카테고리 이름은 사용 불가합니다.",
        button: "확인",
      });
    } else if (res.message && res.message.indexOf("KEY_ERROR") !== -1) {
      swal({
        text: "필수 입력 정보가 누락되었습니다.",
        button: "확인",
      });
    } else if (res.message === "SUCCESS") {
      swal({
        text: "업데이트에 성공했습니다.",
        button: "확인",
      }).then(() => this.getCategoryList());
    } else {
      swal({
        text: "업데이트 정보가 잘못되었습니다. 다시 시도해주세요.",
        button: "확인",
      });
    }
  };

  render() {
    const { selectedCategory, categoryList, newItem } = this.state;

    return (
      <AdminLayout>
        <div className="admin_section admin_category_sort_wrapper">
          <div className="admin_content_title">카테고리 관리</div>
          <div className="admin_content">
            <div className="category_sort_wrap" ref={this.sortSection}>
              {/* 탭 섹션 */}
              <div className="tab_sect">
                <button
                  className="up_btn"
                  aria-label="위로"
                  onClick={() => this.handleReorder("up")}
                  disabled={typeof selectedCategory !== "number"}
                />
                <button
                  className="down_btn"
                  aria-label="아래로"
                  onClick={() => this.handleReorder("down")}
                  disabled={typeof selectedCategory !== "number"}
                />
              </div>

              {/* 순서 변경 섹션 */}
              <div className="reorder_sect">
                <ul>
                  <li className="table_head">
                    <p>이름</p>
                    <p>url</p>
                    <p>관리</p>
                  </li>
                  {categoryList.map((el, idx) => (
                    <li
                      key={idx}
                      className={`sort_row ${
                        selectedCategory === idx ? "selected" : ""
                      }`}
                      onClick={() => this.selectCategory(idx)}
                      onKeyDown={() => this.selectCategory(idx)}
                    >
                      <input
                        type="text"
                        onChange={(e) => this.setInput(e, idx, "category_name")}
                        value={el.category_name}
                      />
                      <input
                        type="text"
                        onChange={(e) => this.setInput(e, idx, "url_name")}
                        value={el.url_name}
                      />
                      <div className="delete_div">
                        <img
                          alt="삭제"
                          src={xButton}
                          onClick={() => this.deleteCategory(el, idx)}
                          onKeyDown={() => this.deleteCategory(el, idx)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 카테고리 추가 섹션 */}
              <div className="add_sect">
                <div>
                  <input
                    onChange={(e) => this.setNewInput(e, "category_name")}
                    value={newItem.category_name || ""}
                  />
                </div>
                <div>
                  <input
                    onChange={(e) => this.setNewInput(e, "url_name")}
                    value={newItem.url_name || ""}
                  />
                </div>
                <div>
                  <button onClick={this.addNewItem}>추가</button>
                </div>
              </div>

              {/* 완료 버튼 섹션 */}
              <div className="bottom_sect">
                <button onClick={this.handleSubmit}>완료</button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default CategoryList;
