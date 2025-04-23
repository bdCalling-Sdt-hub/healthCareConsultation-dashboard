import { imageUrl } from "../redux/api/baseApi";

export const getImageUrl = (src) => {
  if (src?.startsWith("http")) {
    return src;
  }
  return `${imageUrl}/${src}`;
};
