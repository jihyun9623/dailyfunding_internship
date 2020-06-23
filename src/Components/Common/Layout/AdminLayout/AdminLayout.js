import Router, { withRouter } from "next/router";

// import swal from "sweetalert";

import AdminMenu from "Components/Common/AdminMenu/AdminMenu";
import { getFetch } from "Utils/GetFetch";

import "./AdminLayout.scss";

class AdminLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOn: true,
      adminCheck: false,
      removeMinWidth: props.removeMinWidth,
    };
  }

  componentDidMount() {
    // http 에서 https 리다이렉트
    const httpTokens = /^http:\/\/(.*)$/.exec(window.location.href);
    if (httpTokens && process.env.NODE_ENV !== "development") {
      window.location.replace(`https://${httpTokens[1]}`);
    }

    getFetch("/users/admin-check", { token: true }, this.adminCheckRes);
  }

  adminCheckRes = (response) => {
    if (response.message === "ADMIN_CHECK_SUCCESS") {
      this.setState({ adminCheck: true });
    } else if (response.message === "ACCESS_DENIED") {
      Router.push("/");
    }
  };

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
    return !this.state.adminCheck ? null : (
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

export default withRouter(AdminLayout);
