const calculateFileSize = (size) => {
  if (size >= 1024 * 1024 * 1024) {
    size = `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  } else if (size >= 1024 * 1024) {
    size = `${(size / (1024 * 1024)).toFixed(1)} MB`;
  } else if (size >= 1024) {
    size = `${(size / 1024).toFixed(1)} KB`;
  } else {
    size += " Byte";
  }
  return size;
};

export default calculateFileSize;
