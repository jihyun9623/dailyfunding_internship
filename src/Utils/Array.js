// array 를 chunk 로 잘라주는 함수입니다.
// console.log(arrayToChunk([1,2,3,4,5], 3));
// ===> [[1,2,3], [4,5]]
export const arrayToChunk = (arr, howMany) => {
  const [list, chunkSize] = [[...arr], howMany];

  if (!arr) {
    return [];
  }
  return new Array(Math.ceil(list.length / chunkSize))
    .fill()
    .map(() => list.splice(0, chunkSize));
};

// array 의 element 순서를 랜덤으로 섞어주는 함수입니다.
export const shuffle = (array) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const splitTag = (tag, guid) => {
  const imgTags = tag.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
  let newTag = {};

  if (imgTags !== null && imgTags.length > 0) {
    for (let i = 0; i < imgTags.length; i++) {
      if (imgTags[i].indexOf(guid) !== -1) {
        newTag = tag.replace(imgTags[i], "");
        return newTag;
      }
    }
    return tag;
  }
  if (imgTags === null) {
    return tag;
  }
};
