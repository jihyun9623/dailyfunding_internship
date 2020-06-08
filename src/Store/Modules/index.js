/*
store/index.js 에선 스토어를 생성한다음에 내보내줍니다. 이렇게 모듈화된 스토어는 브라우저쪽에서만 사용되는 스토어입니다 
여러개의 리듀서가 있을 때에는, redux 의 함수 combineReducers 를 사용하여 하나의 리듀서로 합쳐줄 수 있습니다. 이렇게 합쳐진 리듀서는 루트 리듀서 라고 부릅니다.
*/
// 만약에 리듀서가 늘어나면 combineReducers({}) 부분에 더 추가를 해주면 됩니다.

import { combineReducers } from "redux";
import { reducer } from "./token";

export default combineReducers({
  reducer,
});
