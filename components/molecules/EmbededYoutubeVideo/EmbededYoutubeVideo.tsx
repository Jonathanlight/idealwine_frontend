import styles from "./EmbededYoutubeVideo.module.scss";

export type Props = {
  embedId: string;
  width: number;
  height: number;
};

const EmbededYoutubeVideo = ({ embedId, height, width }: Props) => (
  <div className={styles.videoContainer}>
    <iframe
      className={styles.videoIframe}
      width={width}
      height={height}
      src={`https://www.youtube.com/embed/${embedId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

export default EmbededYoutubeVideo;
