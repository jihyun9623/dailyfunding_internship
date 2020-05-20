const randomColor = () => {
  const hexValues = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
  ];
  let newColor = "#";

  for (let i = 0; i < 6; i++) {
    const x = Math.round(Math.random() * 14);
    const y = hexValues[x];
    newColor += y;
  }
  return newColor;
};

export default randomColor;
