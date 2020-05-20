import React from "react";

import ItemCount from "Components/ItemCount";
import Pagination from "Components/Pagination";
import * as constants from "constants.js";

class Example extends React.Component {
  state = {
    itemCount: 15, // 10, 15, 20, 50, 100 중 초기값을 선택해 주시면 됩니다.
    pageNum: 1, // ItemCount 컴포넌트는 반드시 Pagination 컴포넌트와 함께 쓰이기에 초기값을 설정해줍니다.
    list: []
  };

  handleItemCount = num => {
    this.setState(
      {
        itemCount: num,
        pageNum: 1 // itemCount가 바뀔때에는 pageNum도 1로 초기화해줍니다.
      },
      () => this.onFetch()
    );
  };

  onFetch = () => {
    // 여기에서 새로 setState 한 itemCount 를 가지고
    // api를 호출해 새로운 리스트를 받으시면 됩니다.

    fetch(
      `${constants.URL_BACK}/list?page_num=${this.state.pageNum}&item_count=${this.state.itemCount}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(response => {
        this.setState({
          list: response.list,
          totalItemNum: response.total_num
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <ItemCount
          itemCount={this.state.itemCount}
          handleItemCount={this.handleItemCount}
        />

        {this.state.list.map((el, idx) => (
          <div key={idx}>{el.title}</div>
        ))}

        <Pagination
          activePage={parseInt(this.state.pageNum)}
          itemsCountPerPage={this.state.itemCount} // itemCount를 Pagination 컴포넌트에 props로 넘겨줍니다.
          totalItemsCount={this.state.totalItemNum}
          change={this.linkPage}
        />
      </React.Fragment>
    );
  }
}

export default Example;
