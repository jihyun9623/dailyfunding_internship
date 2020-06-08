// import Router from "next/router";

// 액션과 리듀서를 기능별로 분류하여 하나의 파일에 작성하게 되는데 이를 module
// 액션 타입 (어떤 모듈에 있는 타입인지 구분짓기위한 상장성 경로)
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

const localStorageCheck = (key) => {
  if (localStorage.getItem(key)) {
    return true;
  } else if (sessionStorage.getItem(key)) {
    return false;
  }
};

export const getToken = () => {
  return async (dispatch, getState) => {
    const refreshToken =
      localStorage.getItem("RFTK") || sessionStorage.getItem("RFTK") || "";
    const tokenObj = {
      token:
        localStorage.getItem("ACTK") || sessionStorage.getItem("ACTK") || "",
      status: "get",
    };

    const { token } = tokenObj;

    tokenCheckF(token);
    const { fetching } = getState().reducer;
    if (refreshToken && token && token.length > 0) {
      if (checkTokenExpired(token)) {
        tokenObj.status = "expired";
        if (!fetching) {
          await dispatch(loadfetching(true));
          tokenObj.status = "refresh_loading";
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
                if (localStorageCheck("ACTK")) {
                  localStorage.setItem("ACTK", response.access_token);
                  dispatch(loadfetching(false));
                } else {
                  sessionStorage.setItem("ACTK", response.access_token);
                  dispatch(loadfetching(false));
                }
                tokenObj.token = response.access_token;
                tokenObj.status = "refreshed";
                return Promise.resolve(tokenObj);
              } else if (response.message === "REFRESH_TOKEN_EXPIRATION") {
                // alert("로그인이 필요한 서비스입니다.");
                // 자동 로그아웃
                localStorage.removeItem("RFTK");
                localStorage.removeItem("ACTK");
                window.location.reload();
              } else if (
                response.message === "REFRESH_TOKEN_DOES_NOT_MATCHED"
              ) {
                // 자동 로그아웃
                localStorage.removeItem("RFTK");
                localStorage.removeItem("ACTK");
                window.location.reload();
              } else if (response.message === "ACCESS_TOKEN_REQUIRED") {
                alert("권한이 없는 페이지 입니다.");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          tokenObj.status = "refresh_not_done";
          return Promise.resolve(tokenObj);
        }
        tokenObj.status = "refresh_not_done";
        return Promise.resolve(tokenObj);
      } else {
        return Promise.resolve(tokenObj);
      }
    } else {
      tokenObj.token = "";
      tokenObj.status = "";
      return Promise.resolve(tokenObj);
    }
  };
};
