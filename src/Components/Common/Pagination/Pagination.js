// 사용 방법
// <Pagination
//   activePage={parseInt(this.state.activePage)} // 현재 active한 페이지. parseInt 안 해주면 간혹 string이 넘겨져서 에러남.
//   itemsCountPerPage={15} // 한 페이지에 몇 개의 item이 뿌려지는지
//   totalItemsCount={this.state.totalLoanCount} // 총 item 갯수
//   change={this.handleLinkPage} // 해당 페이지 번호를 클릭했을 때의 로직
// />

import React, { Component } from "react";

import Pagination from "react-js-pagination";

import "./Pagination.scss";

class pagination extends Component {
  render() {
    const {
      activePage,
      totalItemsCount,
      change,
      itemsCountPerPage,
      pageRangeDisplayed,
    } = this.props;

    return (
      <>
        <Pagination
          activePage={parseInt(activePage)}
          itemsCountPerPage={itemsCountPerPage}
          totalItemsCount={totalItemsCount || 1} // 결과가 없을 때에도 1 숫자 render
          pageRangeDisplayed={pageRangeDisplayed || 10}
          onChange={change}
          itemClassPrev="pre_btn"
          itemClassNext="nxt_btn"
          itemClassFirst="first_btn"
          itemClassLast="last_btn"
          activeClass="active_pg_num"
          innerClass="pagination"
          itemClass="pages"
          prevPageText={"<"}
          nextPageText={">"}
        />
      </>
    );
  }
}

export default pagination;
