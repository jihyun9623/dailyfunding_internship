import Router from "next/router";

import swal from "sweetalert";

export const checkTokenExpired = (token) => {
  try {
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

    if (currentTime > jwt.exp - 30) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

export const alert = (text) => {
  if (localStorage.getItem("ACTK")) {
    localStorage.removeItem("RFTK");
    localStorage.removeItem("ACTK");
  } else if (sessionStorage.getItem("ACTK")) {
    sessionStorage.removeItem("RFTK");
    sessionStorage.removeItem("ACTK");
  }
  swal({
    text,
    button: "확인",
  }).then(() => {
    Router.push("/");
  });
};
