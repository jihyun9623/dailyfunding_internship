import React from "react";

import "./ItemCount.scss";

class ItemCount extends React.Component {
  render() {
    const { itemCount } = this.props;
    return (
      <div className="item_count_div">
        {/* <p>페이지당 아이템 갯수</p> */}
        <div
          className={`item_count ${
            parseInt(itemCount) === 10 ? "selected" : ""
          }`}
          onClick={() => this.props.handleItemCount(10)}
          onKeyDown={() => this.props.handleItemCount(10)}
        >
          10
        </div>
        <div
          className={`item_count ${
            parseInt(itemCount) === 15 ? "selected" : ""
          }`}
          onClick={() => this.props.handleItemCount(15)}
          onKeyDown={() => this.props.handleItemCount(15)}
        >
          15
        </div>
        <div
          className={`item_count ${
            parseInt(itemCount) === 20 ? "selected" : ""
          }`}
          onClick={() => this.props.handleItemCount(20)}
          onKeyDown={() => this.props.handleItemCount(20)}
        >
          20
        </div>
        <div
          className={`item_count ${
            parseInt(itemCount) === 50 ? "selected" : ""
          }`}
          onClick={() => this.props.handleItemCount(50)}
          onKeyDown={() => this.props.handleItemCount(50)}
        >
          50
        </div>
      </div>
    );
  }
}

export default ItemCount;
