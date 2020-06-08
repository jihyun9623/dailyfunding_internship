// sass 설정
const withCSS = require("@zeit/next-css");
const withSass = require("@zeit/next-sass");
// absolute path 설정
const path = require("path");
// ckeditor
// const CKEditorWebpackPlugin = require("@ckeditor/ckeditor5-dev-webpack-plugin");
const { styles } = require("@ckeditor/ckeditor5-dev-utils");
// 환경변수 설정
require("dotenv").config();

module.exports = withCSS(
  withSass({
    webpack(config) {
      // sass 설정
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 100000,
          },
        },
      });

      // absolute path
      config.resolve.modules.push(__dirname);

      config.resolve = {
        alias: {
          "@src": path.join(__dirname, "src"),
          "@Components": path.join(__dirname, "src", "Components"),
          "@pages": path.join(__dirname, "src", "pages"),
          "@Style": path.join(__dirname, "src", "Style"),
          "@Store": path.join(__dirname, "src", "Store"),
          "@Utils": path.join(__dirname, "src", "Utils"),
          "@Img": path.join(__dirname, "public", "Img"),
          "@constants": path.join(__dirname, "constants.js"),
        },
        ...config.resolve,
      };

      // 이 코드를 붙이면 Editor.js 에 있는 내용과 중첩되어
      // Multiple assets emit different content to the same filename translations/ko.js
      // 해당 에러를 뱉음.
      // config.plugins.push(new CKEditorWebpackPlugin({ language: "ko" }));

      // 1. 기존 nextjs webpack 처리를 ckeditor에서 처리할 부분을 제외하고 할 수 있도록 설정
      config.module.rules.forEach((rule, index, array) => {
        // const test = rule.test.toString(); 가 안 돼서
        // 아래처럼 바꿨더니 됨.
        const test = `${rule.test}`;
        if (test.includes("css")) {
          array[index] = {
            ...rule,
            exclude: /ckeditor5-[^/]+\/theme\/[\w-/]+\.css$/,
          };
        } else if (test.includes("svg")) {
          array[index] = {
            ...rule,
            exclude: /ckeditor5-[^/]+\/theme\/icons\/.+\.svg$/,
          };
        }
      });

      // 2. ckeditor css 처리
      config.module.rules.push({
        test: /ckeditor5-[^/]+\/theme\/[\w-/]+\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag",
            },
          },
          {
            loader: "postcss-loader",
            options: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve("@ckeditor/ckeditor5-theme-lark"),
              },
              minify: true,
            }),
          },
        ],
      });

      // 3. ckeditor svg 처리
      config.module.rules.push({
        test: /ckeditor5-[^/]+\/theme\/icons\/.+\.svg$/,
        use: ["raw-loader"],
      });

      return config;
    },
    // env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    //   FRONT_URL: process.env.FRONT_URL,
    //   BACKEND_HOST: process.env.BACKEND_HOST,
    // },
  }),
);
