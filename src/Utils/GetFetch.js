// import * as constants from "constants.js";
// import store from "Store";
// import download from "downloadjs";
// import swal from "sweetalert";
// import { getToken } from "Store/Modules/token";

// const localStorageCheck = (key) => {
//   if (localStorage.getItem(key)) {
//     return true;
//   } else if (sessionStorage.getItem(key)) {
//     return false;
//   }
// };

// // GET fetch 함수입니다.
// export const getFetch = async (parameter, { token: tokenStatus }, callback) => {
//   const token =
//     localStorage.getItem("ACTK") || sessionStorage.getItem("ACTK") || "";

//   if (tokenStatus === false) {
//     // 토큰을 사용하지 않는 경우
//     fetch(`${constants.URL_BACK}${parameter}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((response) => {
//         callback(response);
//       })
//       .catch((err) => {
//         console.log(err, parameter);
//       });
//   } else {
//     await store.dispatch(getToken()).then(async (tokenObj) => {
//       if (tokenObj.status === "get") {
//         await fetchOn(parameter, callback);
//       } else if (
//         tokenObj.status === "refresh_loading" ||
//         tokenObj.status === "refresh_not_done"
//       ) {
//         const check = setInterval(function () {
//           const { fetching } = store.getState().reducer;

//           if (!fetching) {
//             fetchOn(parameter, callback);
//             clearInterval(check);
//           }
//         }, 500);
//       } else if (tokenStatus === "any") {
//         // 토큰을 사용하지만, 토큰이 없어도 에러메세지 없이 호출해야 하는 경우
//         await fetchOn(parameter, callback);
//       } else if (!token && tokenStatus === true) {
//         alert("로그인이 필요한 서비스입니다.");
//       }
//     });
//   }
// };

// const fetchOn = async (parameter, callback) => {
//   const token =
//     localStorage.getItem("ACTK") || sessionStorage.getItem("ACTK") || "";
//   await fetch(`${constants.URL_BACK}${parameter}`, {
//     method: "GET",
//     headers: token
//       ? {
//           "Content-Type": "application/json",
//           Authorization: token,
//         }
//       : {
//           "Content-Type": "application/json",
//         },
//   })
//     .then((response) => response.json())
//     .then(async (response) => {
//       if (response.message === "USER_DOES_NOT_EXIST") {
//         alert("존재하지 않는 회원입니다.");
//       } else if (response.message === "TOKEN_INVALID") {
//         alert("비정상적인 로그인 방식입니다.");
//       } else if (response.message === "TOKEN_EXPIRATION") {
//         alert("로그인 시한이 만료되었습니다. 다시 로그인해주세요.");
//       } else if (response.message === "ACCESS_TOKEN_NOT_EXIST") {
//         alert("로그인이 필요한 서비스입니다.");
//       } else {
//         await callback(response);
//       }
//     })
//     .catch((err) => {
//       console.log(err, parameter);
//     });
// };

// // 파일 다운로드 fetch 함수입니다.
// export const getDownLoad = async (parameter, fileName, fileType, callback) => {
//   await store.dispatch(getToken()).then(async (tokenObj) => {
//     if (tokenObj.status === "get") {
//       await downLoadOn(parameter, fileName, fileType, callback);
//     } else if (
//       tokenObj.status === "refresh_loading" ||
//       tokenObj.status === "refresh_not_done"
//     ) {
//       const check = setInterval(function () {
//         const { fetching } = store.getState().reducer;
//         if (!fetching) {
//           downLoadOn(parameter, fileName, fileType, callback);
//           clearInterval(check);
//         }
//       }, 500);
//     }
//   });
// };

// const downLoadOn = async (parameter, fileName, fileType, callback) => {
//   const token =
//     localStorage.getItem("ACTK") || sessionStorage.getItem("ACTK") || "";
//   await fetch(`${constants.URL_BACK}${parameter}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token,
//     },
//     responseType: "arraybuffer",
//   })
//     .then(async (response) => {
//       if (response.status === 200) {
//         response.blob().then(
//           (blob) => {
//             download(blob, `${fileName}`, `${fileType}`);
//           },
//           async () => {
//             await callback(response);
//           },
//         );
//       } else {
//         swal({
//           text: "다운로드에 실패했습니다.",
//           button: "확인",
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err, parameter);
//     });
// };

// // POST fetch 함수입니다.
// export const postFetch = async (
//   parameter,
//   { token: tokenStatus },
//   bodyData,
//   callback,
//   resolve,
// ) => {
//   const token =
//     localStorage.getItem("ACTK") || sessionStorage.getItem("ACTK") || "";

//   if (tokenStatus === false) {
//     // 토큰을 사용하지 않는 경우
//     fetch(
//       `${constants.URL_BACK}${parameter}`,
//       bodyData
//         ? {
//             method: "POST",
//             body: bodyData,
//           }
//         : {
//             method: "POST",
//           },
//     )
//       .then((response) => response.json())
//       .then((response) => {
//         callback(response, resolve);
//       })
//       .catch((err) => {
//         console.log(err, parameter);
//       });
//   } else {
//     await store.dispatch(getToken()).then(async (tokenObj) => {
//       if (tokenObj.status === "get") {
//         await postOn(parameter, bodyData, callback, resolve);
//       } else if (
//         tokenObj.status === "refresh_loading" ||
//         tokenObj.status === "refresh_not_done"
//       ) {
//         const check = setInterval(function () {
//           const { fetching } = store.getState().reducer;

//           if (!fetching) {
//             postOn(parameter, bodyData, callback, resolve);
//             clearInterval(check);
//           }
//         }, 500);
//       } else if (tokenStatus === "any") {
//         // 토큰을 사용하지만, 토큰이 없어도 에러메세지 없이 호출해야 하는 경우
//         await postOn(parameter, bodyData, callback, resolve);
//       } else if (!token && tokenStatus === true) {
//         alert("로그인이 필요한 서비스입니다.");
//       }
//     });
//   }
// };

// const postOn = async (parameter, bodyData, callback, resolve) => {
//   const token =
//     localStorage.getItem("ACTK") || sessionStorage.getItem("ACTK") || "";
//   await fetch(
//     `${constants.URL_BACK}${parameter}`,
//     bodyData
//       ? {
//           method: "POST",
//           headers: {
//             Authorization: token,
//           },
//           body: bodyData,
//         }
//       : {
//           method: "POST",
//           headers: {
//             Authorization: token,
//           },
//         },
//   )
//     .then((response) => response.json())
//     .then(async (response) => {
//       if (response.message === "USER_DOES_NOT_EXIST") {
//         alert("존재하지 않는 유저입니다.");
//       } else if (response.message === "TOKEN_INVALID") {
//         alert("비정상적인 로그인 방식입니다.");
//       } else if (response.message === "TOKEN_EXPIRATION") {
//         alert("로그인 시한이 만료되었습니다. 다시 로그인해주세요.");
//       } else if (response.message === "ACCESS_TOKEN_NOT_EXIST") {
//         alert("로그인이 필요한 서비스입니다.");
//       } else {
//         await callback(response, resolve);
//       }
//     })
//     .catch((err) => {
//       console.log(err, parameter);
//     });
// };

// // POST fetch 함수입니다.
// export const deleteFetch = async (parameter, bodyData, callback) => {
//   await store.dispatch(getToken()).then(async (tokenObj) => {
//     if (tokenObj.status === "get") {
//       await deleteOn(parameter, bodyData, callback);
//     } else if (
//       tokenObj.status === "refresh_loading" ||
//       tokenObj.status === "refresh_not_done"
//     ) {
//       const check = setInterval(function () {
//         const { fetching } = store.getState().reducer;
//         if (!fetching) {
//           deleteOn(parameter, bodyData, callback);
//           clearInterval(check);
//         }
//       }, 500);
//     }
//   });
// };

// const deleteOn = async (parameter, bodyData, callback) => {
//   const token =
//     localStorage.getItem("ACTK") || sessionStorage.getItem("ACTK") || "";
//   await fetch(
//     `${constants.URL_BACK}${parameter}`,
//     bodyData
//       ? {
//           method: "DELETE",
//           headers: {
//             Authorization: token,
//           },
//           body: bodyData,
//         }
//       : {
//           method: "DELETE",
//           headers: {
//             Authorization: token,
//           },
//         },
//   )
//     .then((response) => response.json())
//     .then(async (response) => {
//       if (response.message === "USER_DOES_NOT_EXIST") {
//         alert("존재하지 않는 유저입니다.");
//       } else if (response.message === "TOKEN_INVALID") {
//         alert("유효하지 않은 로그인 정보입니다. 다시 시도해주세요.");
//       } else if (response.message === "TOKEN_EXPIRATION") {
//         alert("로그인 시한이 만료되었습니다. 다시 로그인해주세요.");
//       } else if (response.message === "ACCESS_TOKEN_NOT_EXIST") {
//         alert("로그인이 필요한 서비스입니다.");
//       } else {
//         await callback(response);
//       }
//     })
//     .catch((err) => {
//       console.log(err, parameter);
//     });
// };

// export const propmiseDownLoad = async (
//   parameter,
//   fileName,
//   fileType,
//   resolve,
// ) => {
//   await store.dispatch(getToken()).then(async (tokenObj) => {
//     if (tokenObj.status === "get") {
//       propmiseDownLoadOn(parameter, fileName, fileType, resolve);
//     } else if (
//       tokenObj.status === "refresh_loading" ||
//       tokenObj.status === "refresh_not_done"
//     ) {
//       const check = setInterval(function () {
//         const { fetching } = store.getState().reducer;
//         if (!fetching) {
//           propmiseDownLoadOn(parameter, fileName, fileType, resolve);
//           clearInterval(check);
//         }
//       }, 500);
//     }
//   });
// };

// const propmiseDownLoadOn = (parameter, fileName, fileType, resolve) => {
//   const token =
//     localStorage.getItem("ACTK") || sessionStorage.getItem("ACTK") || "";

//   fetch(`${constants.URL_BACK}${parameter}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token,
//     },
//     responseType: "arraybuffer",
//   })
//     .then((response) => {
//       if (response.status === 200) {
//         response.blob().then((blob) => {
//           resolve(download(blob, `${fileName}`, `${fileType}`));
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err, parameter);
//     });
// };

// const alert = (text) => {
//   if (localStorageCheck("ACTK")) {
//     localStorage.removeItem("ACTK");
//     localStorage.removeItem("RFTK");
//   } else {
//     sessionStorage.removeItem("ACTK");
//     sessionStorage.removeItem("RFTK");
//   }

//   swal({
//     text,
//     button: "확인",
//   }).then(() => {
//     window.location.href = "/login";
//   });
// };
