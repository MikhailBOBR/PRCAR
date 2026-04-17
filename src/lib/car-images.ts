type CarImageLike = {
  url: string;
};

const demoImagePrefix = "/images/demo/";

export function isDemoCarImage(url: string) {
  return url.startsWith(demoImagePrefix);
}

export function hasUploadedCarImages<T extends CarImageLike>(images: T[]) {
  return images.some((image) => !isDemoCarImage(image.url));
}

export function getPreferredCarImages<T extends CarImageLike>(images: T[]) {
  const uploadedImages = images.filter((image) => !isDemoCarImage(image.url));
  return uploadedImages.length > 0 ? uploadedImages : images;
}
