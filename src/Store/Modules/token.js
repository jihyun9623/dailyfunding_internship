// import Router from "next/router";

// 액션과 리듀서를 기능별로 분류하여 하나의 파일에 작성하게 되는데 이를 module
// 액션 타입 (어떤 모듈에 있는 타입인지 구분짓기위한 상장성 경로)

import swal from "sweetalert";

import { checkTokenExpired, alert } from "Store/Lib/Function";
import * as constants from "constants.js";

const LOAD_FETCHING = "token/LOAD_FETCHING";

export const loadfetching = (fetching) => ({
  type: LOAD_FETCHING,
  fetching,
});

export const initialState = {
  reducer: {
    fetching: false,
  },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FETCHING:
      return {
        ...state,
        fetching: action.fetching,
      };
    default:
      return state;
  }
};

const tokenCheckF = (token) => {
  if (!token) {
    return;
  }
  const currentTime = new Date().getTime() / 1000;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join(""),
  );
  const jwt = JSON.parse(jsonPayload);

  console.log(Math.floor(jwt.exp) - Math.floor(currentTime));
};

export const getToken = () => {
  return async (dispatch, getState) => {
    const refreshToken = localStorage.getItem("RFTK") || "";
    const tokenObj = {
      token: localStorage.getItem("ACTK") || "",
      status: "get",
    };

    const { token } = tokenObj;

    tokenCheckF(token);
    const { fetching } = getState().reducer;

    if (refreshToken && token && token.length > 0) {
      // 만료되지않고 토큰이 유효할때
      if (checkTokenExpired(token)) {
        tokenObj.status = "expired";
        // 만료되고 리프레쉬전
        if (!fetching) {
          await dispatch(loadfetching(true));
          tokenObj.status = "refresh_loading";
          // 만료되고 리프레쉬 시작
          await fetch(`${constants.URL_BACK}/users/auth/refresh`, {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: JSON.stringify({
              refresh_token: refreshToken,
            }),
          })
            .then((response) => response.json())
            .then((response) => {
              if (response.access_token) {
                localStorage.setItem("ACTK", response.access_token);
                dispatch(loadfetching(false));
                tokenObj.token = response.access_token;
                tokenObj.status = "refreshed";
                // 리프레쉬 완료
                return Promise.resolve(tokenObj);
              } else if (response.message === "REFRESH_TOKEN_EXPIRATION") {
                // alert("로그인이 필요한 서비스입니다.");
                // 자동 로그아웃
                localStorage.removeItem("RFTK");
                localStorage.removeItem("ACTK");
                tokenObj.token = "";
                tokenObj.status = "";
                // 리프레쉬 실패 1
                window.location.reload();
                return Promise.resolve(tokenObj);
              } else if (
                response.message === "REFRESH_TOKEN_DOES_NOT_MATCHED"
              ) {
                // 자동 로그아웃
                localStorage.removeItem("RFTK");
                localStorage.removeItem("ACTK");
                tokenObj.token = "";
                tokenObj.status = "";
                // 리프레쉬 실패 2
                return Promise.resolve(tokenObj);
              } else if (response.message === "ACCESS_TOKEN_REQUIRED") {
                alert("권한이 없는 페이지 입니다.");
                tokenObj.token = "";
                tokenObj.status = "";
                // 권한 없음
              } else if (response.message === "UNUSUAL_APPROACH") {
                // 백엔드에서 요청한 alert. 확인 필요
                // agent 정보가 없는 유저일 경우임.
                swal({
                  text: "비정상적인 접근입니다.",
                  button: "확인",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          tokenObj.status = "refresh_not_done";
          // 리프레시 아직 진행중
          return Promise.resolve(tokenObj);
        }
        // 토큰이 만료되었으나 리프레쉬를 타지 않음.
        tokenObj.status = "refresh_not_done";
        return Promise.resolve(tokenObj);
      } else {
        // 토큰이 만료되지 않았을때 2
        return Promise.resolve(tokenObj);
      }
    } else {
      // 만료되지않고 애초에 토큰이 없을때
      tokenObj.token = "";
      tokenObj.status = "";

      return Promise.resolve(tokenObj);
    }
  };
};
