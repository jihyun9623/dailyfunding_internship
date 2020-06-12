import App from "next/app";

import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import modules from "Store/Modules";
import { initialState } from "Store/Modules/token";

// 공통 css
import "Style/_reset.scss";
import "Style/_common.scss";
import "Style/_font.scss";

// 라이브러리 css
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-alice-carousel/lib/alice-carousel.css";
import "react-toastify/dist/ReactToastify.css";

let store;

const configureStore = () => {
  const composeEnhancers = compose(applyMiddleware(thunk));
  // 미들웨어들을 넣으면 된다.
  // const middlewares = [];
  // const enhancer =
  //   process.env.NODE_ENV === "production"
  //     ? compose(applyMiddleware(...middlewares))
  //     : composeWithDevTools(applyMiddleware(...middlewares));
  store = createStore(modules, initialState, composeEnhancers);
  return store;
};

class DailyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default withRedux(configureStore)(DailyApp);
