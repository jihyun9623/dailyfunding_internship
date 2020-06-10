import { withRouter } from "next/router";

import swal from "sweetalert";

import { getFetch, postFetch } from "Utils/GetFetch";
import { queryToObject, getParams } from "Utils/QueryString";
import * as constants from "constants.js";

class AdminLayout extends React.Component {
  state = {
    guid: queryToObject(this.props.router.asPath).guid || "",
  };

  componentDidMount() {
    /* ----------------------------------------------------- */
    /*                                                       */
    /*          데일리펀딩 로그인을 통해 유입되었을 경우 처리           */
    /*                                                       */
    /* ----------------------------------------------------- */

    const { guid } = this.state;
    const token = localStorage.getItem("ACTK") || "";

    if (guid && !token) {
      getFetch(`/users/auth?guid=${guid}`, { token: false }, (res) => {
        if (res.message === "NOT_MATCHED_CODE") {
          swal({
            text:
              "데일리펀딩과 데일리 인사이트를 연결하는 데 실패했습니다. 다시 시도해주세요.",
            button: "확인",
          });
        } else if (res.message === "USER_AUTH_DOES_NOT_EXIST") {
          swal({
            text:
              "로그인 내역이 없습니다. 데일리펀딩 사이트를 통해 로그인해주세요.",
            button: "확인",
          }).then(() => {
            window.open(
              `${
                constants.URL_LOGIN
              }/bbs/login.php?from=dailyblog&fromurl=${encodeURIComponent(
                `${this.props.router.asPath}`,
              )}`,
            );
          });
        } else if (res.token) {
          localStorage.setItem("ACTK", res.token);
          localStorage.setItem("RFTK", res.refresh_token);
          this.adminCheck();
          // 추후 다른 로직으로 교체 가능한지 검토 필요. 토큰이 필요한 데이터를 refresh 해주는 역할.
          // 댓글창을 통해 로그인해서 들어올 경우, 코멘트 리스트가 토큰 세팅 전에 미리 호출되기 때문에
          // 토큰 세팅 후에 refresh 해줘야 함.
          // 메인페이지의 경우에도 관리자만 비공개 포스트를 볼 수 있기 때문에 토큰 세팅 후 refresh 해줘야 함.
          this.props.refreshData();
        } else {
          this.adminCheck();
        }
      });
    } else if (token) {
      this.adminCheck();
    }

    /* ----------------------------------------------------- */
    /*                                                       */
    /*                  유저 액세스 로그 체크                     */
    /*                                                       */
    /* ----------------------------------------------------- */

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
      // Next 로 만든 웹페이지는 SPA 형식이라 document.referrer 미작동
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
    });

    postFetch(`/access_logs`, { token: "any" }, data, () => {});

    sessionStorage.setItem("current_url", this.props.router.pathname);
    sessionStorage.setItem(
      "current_par",
      getParams(this.props.router.asPath) || "",
    );
  }

  /* ----------------------------------------------------- */
  /*                                                       */
  /*                    관리자인지 체크                        */
  /*                                                       */
  /* ----------------------------------------------------- */

  adminCheck = () => {
    getFetch("/users/admin-check", { token: "any" }, this.adminCheckRes);
  };

  adminCheckRes = (response) => {
    if (response.message === "ADMIN_CHECK_SUCCESS") {
      this.props.setIsAdmin(true);
    }
  };

  render() {
    return <>{this.props.children}</>;
  }
}

export default withRouter(AdminLayout);
