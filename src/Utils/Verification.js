// 아이디 형식 체크. 시작은 영문으로만, "_"를 제외한 특수문자 불가, 영문/숫자/"_"로만 이루어진 5-12자 이하
// this.setState({
//   id: idCheck(e.target.value)
// });
export const idCheck = (x) => {
  const reg = /[^a-z0-9_]/g;
  if (reg.test(x)) {
    return x.slice(0, x.length - 1);
  } else {
    return x;
  }
};

// 아이디 형식 체크. "_", "-", ".(dot)"를 제외한 특수문자 불가, 한글 및 스페이스바 입력 불가
// onKeyUp={idCheck2}
export const idCheck2 = (e) => {
  const strSpace = /\s/;
  if (strSpace.exec(e.target.value)) {
    e.target.value = e.target.value.replace(" ", "");
    return false;
  }

  if (
    e.keyCode === 8 ||
    e.keyCode === 9 ||
    e.keyCode === 37 ||
    e.keyCode === 39 ||
    e.keyCode === 46
  )
    return;

  e.target.value = e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");
  e.target.value = e.target.value.replace(
    // /[~!@\\#$%^&*\\()=+'\\;<>\\/.\\`:\\"\\,\\[\]?|{}]/g, -> 이건 . 불가
    /[~!@\\#$%^&*\\()=+'\\;<>\\/\\`:\\"\\,\\[\]?|{}]/g,
    "",
  );
};

// 이메일 도메인 형식 체크. ".", "-"를 제외한 특수문자 불가, 한글 및 스페이스바 입력 불가
// onKeyUp={domainCheck}
export const domainCheck = (e) => {
  const strSpace = /\s/;
  if (strSpace.exec(e.target.value)) {
    e.target.value = e.target.value.replace(" ", "");
    return false;
  }

  if (
    e.keyCode === 8 ||
    e.keyCode === 9 ||
    e.keyCode === 37 ||
    e.keyCode === 39 ||
    e.keyCode === 46
  )
    return;

  e.target.value = e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");
  e.target.value = e.target.value.replace(
    /[~!@\\#$%^&*\\()_=+'\\;<>\\/\\`:\\"\\,\\[\]?|{}]/g,
    "",
  );
};

// 이메일 형식 체크
export const emailCheck = (x) => {
  const regExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;

  if (regExp.test(x)) {
    return true;
  } else {
    return false;
  }
};

// 스페이스바 입력 체크
// onKeyUp={spaceCheck}
export const spaceCheck = (e) => {
  const strSpace = /\s/;
  if (strSpace.exec(e.target.value)) {
    e.target.value = e.target.value.replace(" ", "");
    return false;
  }
};

// 한글 입력 체크
// onKeyUp={noHangeul}
export const noHangeul = (e) => {
  if (
    e.keyCode === 8 ||
    e.keyCode === 9 ||
    e.keyCode === 37 ||
    e.keyCode === 39 ||
    e.keyCode === 46
  )
    return;
  e.target.value = e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");
};
