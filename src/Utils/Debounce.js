const handleWindowResize = (callback) => {
  let timer;
  if (!timer) {
    timer = setTimeout(() => {
      timer = null;
      callback();
    }, 200);
  }
};

export const resize = (callback) => {
  window.addEventListener("resize", () => handleWindowResize(callback));
};

export const removeResize = () => {
  window.removeEventListener("resize", handleWindowResize);
};
