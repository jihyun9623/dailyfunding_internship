// 상수들을 사용할 경우 아래를 상단에 import 해주세요.
// import * as constants from 'constants.js';

// 백엔드 주소 앞부분은 전부 `${constants.URL_BACK}` 으로 통일해주시면 됩니다!!
// 이렇게 설정한 후 constants.js 상에서의 주소를 변경해주면 자동으로 모든 곳에서 변경됩니다.

export const URL_BACK =
  process.env.BACKEND_HOST || "http://daily-funding.com:8000";
// (process.env.REACT_APP_ENV === "local" && "http://localhost:8000") ||
// (process.env.REACT_APP_ENV === "hj" && "http://192.168.0.6:8000") ||
// (process.env.REACT_APP_ENV === "yh" && "http://192.168.0.109:8000") ||
// (process.env.REACT_APP_ENV === "mh" && "http://192.168.0.46:8000") ||
// (process.env.REACT_APP_ENV === "sy" && "http://192.168.0.49:8000") ||
// (process.env.REACT_APP_ENV === "prod" && "http://daily-funding.com:8000") ||
// (process.env.REACT_APP_ENV === "prod-test" &&
//   "http://dev.daily-funding.com:8000") ||
// "http://daily-funding.com:8000";

export const URL_FRONT = process.env.FRONT_URL || "daily-funding.com";
// (process.env.REACT_APP_ENV === "local" && "localhost") ||
// (process.env.REACT_APP_ENV === "hj" && "localhost") ||
// (process.env.REACT_APP_ENV === "yh" && "localhost") ||
// (process.env.REACT_APP_ENV === "mh" && "localhost") ||
// (process.env.REACT_APP_ENV === "sy" && "localhost") ||
// (process.env.REACT_APP_ENV === "prod" && "daily-funding.com") ||
// (process.env.REACT_APP_ENV === "prod-test" && "dev.daily-funding.com") ||
// "daily-funding.com";

// recaptcha 키입니다.
// constants.RECAPTCHA_KEY 로 쓰시면 됩니다.
export const RECAPTCHA_KEY = "6LfBQbAUAAAAANY8KXFw9R-dw7F7Mz9PMtUbZEQl";

// kakao 키입니다. 임시 키입니다.
export const KAKAO_KEY = "afd76f2ce390290b91c1f9491b48061a";

// breakpoint 변수입니다. js 파일에서 직접 windowSize 를 받아와 미디어쿼리를 적용하는 경우
// constants.BREAK_PC 와 같은 형식으로 끌어다 사용하면 됩니다.
export const BREAK_PC_L = 1200;
export const BREAK_PC_M = 1046;
export const BREAK_PC_S = 992;
export const BREAK_TAB = 768;
export const BREAK_MOB = 414;
