import AdminMenu from "Components/Common/AdminMenu/AdminMenu";

import "./AdminLayout.scss";

class AdminLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOn: true,
      // adminCheck: false,
      removeMinWidth: props.removeMinWidth,
    };
  }

  handleClickMenu = () => {
    if (this.state.menuOn === true) {
      this.setState({
        menuOn: false,
      });
    } else if (this.state.menuOn === false) {
      this.setState({
        menuOn: true,
      });
    }
  };

  render() {
    // return !this.state.adminCheck ? null : (
    return (
      <div
        className="admin_wrapper"
        style={
          this.state.removeMinWidth ? { minWidth: "unset" } : { width: "unset" }
        }
      >
        <AdminMenu menuClick={this.handleClickMenu} />
        <div
          className={
            this.state.menuOn
              ? `flexible_admin_wrapper_1`
              : `flexible_admin_wrapper_2`
          }
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AdminLayout;
