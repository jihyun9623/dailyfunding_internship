const isPassive = () => {
  let supportsPassiveOption = false;
  try {
    document.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: () => {
          supportsPassiveOption = true;
        },
      }),
    );
  } catch (e) {
    console.log(e);
  }
  return supportsPassiveOption;
};

export default isPassive;
