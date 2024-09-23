import Image from "next/image";
import { MouseEvent, useState } from "react";

import { isDesktop } from "@/styles/breakpoints";

import styles from "./ImageMagnifier.module.scss";

type ImageMagnifierProps = {
  unoptimized?: boolean;
  src: string;
  alt: string;
  magnifierSize: number;
  zoomLevel: number;
  fill: boolean;
  onClick?: () => void;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

const ImageMagnifier = ({
  unoptimized,
  src,
  alt,
  magnifierSize,
  zoomLevel,
  fill,
  onClick,
  sizes,
  priority,
  className,
}: ImageMagnifierProps) => {
  const [isZoomable, setIsZoomable] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, mouseX: 0, mouseY: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;

    const { width, height } = e.currentTarget.getBoundingClientRect();
    setImageSize({ width, height });
    setIsZoomable(true);
    updatePosition(e);
  };

  const handleMouseLeave = () => {
    setIsZoomable(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;

    updatePosition(e);
  };

  const updatePosition = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setPosition({
      x: -x * zoomLevel + magnifierSize / 2,
      y: -y * zoomLevel + magnifierSize / 2,
      mouseX: x - magnifierSize / 2,
      mouseY: y - magnifierSize / 2,
    });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      className={styles.imageWrapper}
    >
      <Image
        unoptimized={unoptimized}
        src={src}
        alt={alt}
        fill={fill}
        onClick={onClick}
        sizes={sizes}
        priority={priority}
        className={className}
      />
      {isZoomable && (
        <div
          className={styles.magnifier}
          style={{
            backgroundPosition: `${position.x}px ${position.y}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${imageSize.width * zoomLevel}px ${imageSize.height * zoomLevel}px`,
            backgroundRepeat: "no-repeat",
            display: "block",
            top: `${position.mouseY}px`,
            left: `${position.mouseX}px`,
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            position: "absolute",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;
