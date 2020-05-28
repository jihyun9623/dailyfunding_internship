import Link from "next/link";
import { withRouter } from "next/router";

// import { getFetch, postFetch } from "Utils/GetFetch";
import { getParams } from "Utils/QueryString";
import * as constants from "constants.js";

import SmallLogo from "@Img/small_logo.png";
import burgerMenu from "@Img/burger_menu_icn.png";
import "./AdminMenu.scss";

class AdminMenu extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menuOn: true,
      adminMenuList: [
        {
          menu_name: "포스트 관리",
          menu_url: "/admin/post",
          child_menu: [
            {
              menu_name: "포스트 관리",
              menu_url: "/admin/post",
            },
            {
              menu_name: "카테고리 관리",
              menu_url: "/admin/category",
            },
          ],
        },
      ],
    };

    this.menuList = React.createRef();
    this.scrollDiv = React.createRef();
    this.nullDiv = React.createRef();
  }

  componentDidMount = () => {
    document.body.classList.remove("overflow_hidden");
    document.documentElement.classList.remove("overflow_hidden");

    // 유저 액세스 로그 체크
    let refUrl;
    let refPar;

    if (
      // 즐겨찾기나 주소창 직접 입력이 아닌, 다른 사이트를 통해 유입될 경우
      document.referrer !== "" &&
      document.domain !== constants.URL_FRONT
    ) {
      refUrl = document.referrer.split("?")[0];
      refPar = document.referrer.split("?")[1]
        ? `?${document.referrer.split("?")[1]}`
        : "";
    } else if (
      // 리액트 홈페이지는 SPA 형식이라 document.referrer 미작동
      // 따라서 홈페이지 내 트래킹은 session storage 이용
      document.referrer === "" ||
      document.domain === constants.URL_FRONT
    ) {
      // 홈페이지 주소를 직접 쳐서 들어오거나 즐겨찾기로 유입되었을 경우에도
      // document.referrer가 빈 스트링으로 들어옴
      // 따라서 session storage의 current_url이 비어있으면 빈 스트링 반환
      refUrl = sessionStorage.getItem("current_url") || "";
      if (sessionStorage.getItem("current_url")) {
        refPar = sessionStorage.getItem("current_par") || "";
      } else {
        refPar = "";
      }
    }

    sessionStorage.setItem("ref_url", refUrl);
    sessionStorage.setItem("ref_par", refPar);

    const data = JSON.stringify({
      page_url: this.props.router.pathname,
      page_parameter: getParams(this.props.router.asPath),
      referrer_url: refUrl,
      referrer_parameter: refPar,
      from_site: "",
    });

    // postFetch(`/access_logs`, { token: "any" }, data, () => {});

    sessionStorage.setItem("current_url", this.props.router.pathname);
    sessionStorage.setItem("current_par", getParams(this.props.router.asPath));

    // 현재 메뉴로 스크롤
    if (this.scrollDiv.current) {
      const currentUrl = sessionStorage.getItem("current_url");

      if (
        currentUrl.indexOf(refUrl) !== -1 ||
        refUrl.indexOf(currentUrl) !== -1
      ) {
        this.menuList.current.scrollTop =
          this.scrollDiv.current.offsetTop -
          (this.menuList.current.offsetHeight / 2 -
            this.scrollDiv.current.clientHeight / 2);
      } else {
        this.scrollDiv.current.scrollIntoView({
          block: "center",
        });
      }
    }
  };

  handleBurger = () => {
    this.props.menuClick();

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

  handleLinkLogout = () => {
    localStorage.removeItem("ACTK");
    localStorage.removeItem("RFTK");
    sessionStorage.removeItem("ACTK");
    sessionStorage.removeItem("RFTK");

    this.props.history.push("/");
  };

  handleMenuArr = (thisArray, num) => {
    if (thisArray) {
      return (
        <div className="one_nav">
          {thisArray.map((el, idx) => (
            <ul key={idx} className={`nav_${num}`}>
              {num === 1 ? (
                <li className={`child_${num}`}>
                  <img alt="로고" src={SmallLogo} />
                  {el.menu_name}
                </li>
              ) : (
                <Link href={el.menu_url}>
                  <li
                    className={`child_${num} ${
                      this.props.router.pathname === el.menu_url ? "active" : ""
                    }`}
                    value={el.menu_url}
                    ref={
                      this.props.router.pathname.indexOf(el.menu_url) !== -1
                        ? this.scrollDiv
                        : this.nullDiv
                    }
                  >
                    {num === 3 && <span style={{ marginRight: 10 }}>-</span>}
                    {el.menu_name}
                  </li>
                </Link>
              )}
              {el.child_menu && this.handleMenuArr(el.child_menu, num + 1)}
            </ul>
          ))}
        </div>
      );
    } else {
      return <div />;
    }
  };

  render() {
    return (
      <div className="admin_menu_wrapper">
        <div className="top_menu">
          <div className="left_top">
            <img
              alt="메뉴 버튼"
              className="burger_menu"
              src={burgerMenu}
              onClick={this.handleBurger}
              onKeyDown={this.handleBurger}
            />
          </div>
          <div className="right_top">
            <Link href="/admin">
              <p className="top_link">관리자 메인</p>
            </Link>
            <Link href="/">
              <p className="top_link">홈페이지</p>
            </Link>
            <p
              className="top_link"
              onClick={this.handleLinkLogout}
              onKeyDown={this.handleLinkLogout}
            >
              로그아웃
            </p>
          </div>
        </div>

        <div
          className={this.state.menuOn ? `side_menu` : `side_menu disappear`}
          ref={this.menuList}
        >
          {this.handleMenuArr(this.state.adminMenuList, 1)}
        </div>
      </div>
    );
  }
}

export default withRouter(AdminMenu);
