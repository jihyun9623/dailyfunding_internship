/* configure.js 는 리덕스 스토어를 생성하는 함수를 모듈화하여 내보냅니다.
이렇게 따로 모듈화를 하는 이유는, 하나의 애플리케이션에서는 하나의 스토어밖에 없긴 
하지만 예외의 케이스가 있기 때문입니다. 나중에 여러분이 서버사이드 렌더링을 하게 된다면, 
서버쪽에서도 각 요청이 처리 될 때마다 스토어를 생성해주어야 하는데요, 
그런 작업을 하게 될 때 이렇게 스토어를 생성하는 함수를 이렇게 모듈화 하곤 합니다.
*/

// (크롬에서 작업할 시) redux-devtools 라는 크롬 익스텐션을 설치해 주세요.
// https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import modules from "./Modules";
import { initialState } from "./Modules/token";

// 브라우저 크롬 여부를 담은 변수
// const isChrome =
//   !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

const configure = () => {
  const composeEnhancers = compose(applyMiddleware(thunk));

  // 브라우저가 크롬이고, 실행 환경이 development 이나 test 일 때에만 REDUX_DEVTOOLS_EXTENSION 을 설정해줍니다.
  // if (
  //   (isChrome && process.env.NODE_ENV === "development") ||
  //   process.env.NODE_ENV === "test"
  // ) {
  //   composeEnhancers = compose(
  //     applyMiddleware(thunk),
  //     window.__REDUX_DEVTOOLS_EXTENSION__ &&
  //       window.__REDUX_DEVTOOLS_EXTENSION__(),
  //   );
  // } else {
  // composeEnhancers = compose(applyMiddleware(thunk));
  // }

  const store = createStore(modules, initialState, composeEnhancers);

  return store;
};

export default configure;
