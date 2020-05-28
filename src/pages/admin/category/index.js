// import Link from "next/link";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";

import xButton from "@Img/red_x_btn.svg";
import "./category.scss";

class CategoryList extends React.Component {
  state = {
    categoryList: [
      {
        category_name: "데일리언",
        url_name: "dailian",
        sorting_number: 1,
      },
      {
        category_name: "개발",
        url_name: "development",
        sorting_number: 2,
      },
      {
        category_name: "꿀팁",
        url_name: "honeytip",
        sorting_number: 3,
      },
      {
        category_name: "정보",
        url_name: "information",
        sorting_number: 4,
      },
    ],
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

  getCategoryList = () => {
    console.log(1);
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
  deleteCategory = (idx) => {
    const { categoryList } = this.state;

    categoryList.splice(idx, 1);

    this.setState({
      categoryList,
    });
  };

  // 수정 완료
  handleSubmit = () => {
    const { categoryList } = this.state;

    for (let i = 0; i < categoryList.length; i++) {
      categoryList[i].sorting_number = i + 1;
    }

    this.setState({
      categoryList,
    });
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
                          onClick={() => this.deleteCategory(idx)}
                          onKeyDown={() => this.deleteCategory(idx)}
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
