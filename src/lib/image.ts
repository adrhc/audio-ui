import { models } from 'mopidy';

export function sortByAbsDiff(imgMaxArea: number, images?: models.Image[] | null) {
  return images?.sort((a, b) => sortImages(imgMaxArea, a, b));
}

function sortImages(imgMaxArea: number, img1: models.Image, img2: models.Image) {
  return imgAreaDistance(imgMaxArea, img1) > imgAreaDistance(imgMaxArea, img2) ? 1 : -1;
}

function imgAreaDistance(imgMaxArea: number, img: models.Image) {
  return Math.abs(imgMaxArea - imgArea(img));
}

function imgArea(img: models.Image) {
  return (img.height ?? 0) * (img.width ?? 0);
}
