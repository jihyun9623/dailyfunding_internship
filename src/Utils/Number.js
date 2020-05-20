// onlyNumber 함수를 쓰실 땐 input type="number"로 해주시고,
// onlyNumber 함수는 onKeyDown 이벤트에 달아야 합니다.
// <input type="number" onKeyDown={e => onlyNumber(e)} />
// input type="text"이거나 설정을 해주지 않을 경우, 한글이 입력됩니다.
export const onlyNumber = (e) => {
  if (
    (e.keyCode >= 48 && e.keyCode <= 57) ||
    (e.keyCode >= 96 && e.keyCode <= 105) ||
    e.keyCode === 8 ||
    e.keyCode === 46 ||
    e.keyCode === 37 ||
    e.keyCode === 39
  ) {
    return;
  } else {
    e.preventDefault();
  }
};

// 숫자일 경우 parseInt 하여 3자리마다 쉼표를 추가해 반환하고,
// - 값이 들어올 경우 포맷팅한 다음 앞에 string - 를 더해 반환하고,
// null 값 등이 들어올 경우 "-"를 반환하고,
// infinite일 경우 "무한"을 반환
export const numberFormat = (num) => {
  if (Number(num) === 0) {
    return 0;
  } else if (Number(num) > 0) {
    // num = Math.floor(num);
    num = parseInt(num);
    return String(num).replace(/(.)(?=(\d{3})+$)/g, "$1,");
  } else if (typeof num === "string" && num[0] === "-") {
    let newStr = num.replace("-", "");
    newStr = parseInt(newStr);
    return `-${String(newStr).replace(/(.)(?=(\d{3})+$)/g, "$1,")}`;
  } else if (num === "infinite") {
    return "무한";
  } else {
    return "-";
  }
};

// 3자리 숫자마다 쉼표 추가 함수
// export const numberFormat = x => {
//   return String(x).replace(/(.)(?=(\d{3})+$)/g, "$1,");
// };

// 숫자인지 아닌지 확인하는 함수
export const checkIfNumber = (x) => {
  const reg = /^(\s|\d)+$/;
  return reg.test(x);
};

// 문자열중에 숫자만 걸러서 리턴함.
export const returnOnlyNumber = (str) => {
  let res = "";
  str = str.toString();
  res = str.replace(/[^0-9]/g, "");
  return Number(res);
};

// 금액을 한글 단위로 표시해주는 함수. 1억 5000만 7000원 <- 이런 식으로 표시됨
export const numberToKorean = (number) => {
  const inputNumber = number < 0 ? false : number;
  const unitWords = ["", "만", "억", "조", "경"];
  const splitUnit = 10000;
  const splitCount = unitWords.length;
  const resultArray = [];
  let resultString = "";

  for (let i = 0; i < splitCount; i++) {
    let unitResult = (inputNumber % (splitUnit ** i + 1)) / splitUnit ** i;
    unitResult = Math.floor(unitResult);
    if (unitResult > 0) {
      resultArray[i] = unitResult;
    }
  }

  for (let i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue;
    resultString =
      String(numberFormat(resultArray[i])) + unitWords[i] + resultString;
  }

  if (parseInt(number) === 0) {
    resultString = 0;
  }

  return resultString;
};

// 십단위 절삭 함수
export const tenUnitsCutting = (price) => {
  let val = parseFloat(price);
  if (Number.isNaN(val)) val = 0;
  const newPrice = Math.floor(val * 0.1) * 10;
  return newPrice;
};

// input number length 제한 할 수 있는 함수
// onInput={maxLengthCheck} 과 같은 형식으로 사용
export const maxLengthCheck = (object) => {
  if (object.target.value.length > object.target.maxLength) {
    object.target.value = object.target.value.slice(0, object.target.maxLength);
  }
};

// str 으로 들어오는 - 또는 + 된 숫자 금액 값 가공하는 함수
export const strNumCheck = (str) => {
  if (str[0] === "-") {
    let newStr = str.replace("-", "");
    newStr = `-${numberFormat(tenUnitsCutting(Number(newStr)))}`;
    return newStr;
  } else if (str[0] === "+") {
    let newStr = str.replace("+", "");
    newStr = `+${numberFormat(tenUnitsCutting(Number(newStr)))}`;
    return newStr;
  }
};

// 전화번호에 hyphen 을 추가하는 함수
export const hyphenTel = (number) => {
  let tel = "";

  // 서울 지역번호(02)가 들어오는 경우
  if (number.substring(0, 2).indexOf("02") === 0) {
    if (number.length < 3) {
      return number;
    } else if (number.length < 6) {
      tel += number.substr(0, 2);
      tel += "-";
      tel += number.substr(2);
    } else if (number.length < 10) {
      tel += number.substr(0, 2);
      tel += "-";
      tel += number.substr(2, 3);
      tel += "-";
      tel += number.substr(5);
    } else {
      tel += number.substr(0, 2);
      tel += "-";
      tel += number.substr(2, 4);
      tel += "-";
      tel += number.substr(6);
    }

    // 서울 지역번호(02)가 아닌경우
  } else if (number.length < 4) {
    return number;
  } else if (number.length < 7) {
    tel += number.substr(0, 3);
    tel += "-";
    tel += number.substr(3);
  } else if (number.length < 11) {
    tel += number.substr(0, 3);
    tel += "-";
    tel += number.substr(3, 3);
    tel += "-";
    tel += number.substr(6);
  } else {
    tel += number.substr(0, 3);
    tel += "-";
    tel += number.substr(3, 4);
    tel += "-";
    tel += number.substr(7);
  }

  return tel;
};

export const removeHyphen = (number) => {
  const val = number.replace("-", "");
  return val;
};

export const addNumber = (num1, num2) => {
  if ((Number(num1) === 0 || num1) && (Number(num2) === 0 || num2)) {
    if (Number(num1) === 0) {
      num1 = 0;
    } else {
      num1 = Math.floor(num1);
    }
    if (Number(num2) === 0) {
      num2 = 0;
    } else {
      num2 = Math.floor(num2);
    }
    const addNum = num1 + num2;
    return numberFormat(addNum);
  } else {
    return "-";
  }
};
