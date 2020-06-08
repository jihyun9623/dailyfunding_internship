// querystring만 반환하는 함수
export const getParams = (str) => {
  if (str.split("?").length === 1) {
    return "";
  } else {
    return `?${str.split("?")[1]}`;
  }
};

// querystring에 있는 문자열을 객체화해서 반환해주는 함수
export const queryToObject = (str) => {
  const params = {};
  const keyValPairs = str.split("?")[1] && str.split("?")[1].split("&");

  if (keyValPairs !== undefined) {
    for (let i = 0; i < keyValPairs.length; i++) {
      params[keyValPairs[i].split("=")[0]] = decodeURI(
        keyValPairs[i].split("=")[1],
        "UTF-8",
      );
    }
  }
  return params;
};

// querystring에 넣고 싶은 정보를 객체 형식으로 만들어 넣어주면
// 완성된 querystring 형식을 반환해주는 함수입니다.

export const objectToQuerystring = (obj) => {
  return Object.keys(obj).reduce((str, key, i) => {
    const delimiter = i === 0 ? "?" : "&";
    const val = encodeURIComponent(obj[key]);
    key = encodeURIComponent(key);
    return [str, delimiter, key, "=", val].join("");
  }, "");
};
