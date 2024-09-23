export enum CarrouselSlideType {
  youtubeVideo = "youtubeVideo",
  video = "video",
  image = "image",
}

export type SlideToCarousel = {
  src: string; // path or embedId
  description?: string;
  type: CarrouselSlideType;
  poster?: string;
};
