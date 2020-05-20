export const filterType = (category) => {
  if (category.code === "0002") {
    return "부동산";
  } else {
    return "동산";
  }
};

export const filterStatus = (num) => {
  const arr = [
    "",
    "",
    "투자중",
    "투자완료",
    "상환중",
    "상환완료",
    "일시상환",
    "실패",
    "연체",
    "부도",
  ];
  return arr[num];
};

export const filterGrade = (num) => {
  const obj = {
    "0001": "일반투자자",
    "0002": "소득요건적격투자자",
    "0003": "전문투자자",
    "0004": "개인대부업",
    "0005": "개인대부업 소득적격자",
    "0006": "개인대부업 전문투자자",
  };

  return obj[num];
};

export const longGradeCheck = (num) => {
  if (num === "0005" || num === "0006") {
    console.log("긴데????", num);
    return true;
  } else {
    return false;
  }
};
