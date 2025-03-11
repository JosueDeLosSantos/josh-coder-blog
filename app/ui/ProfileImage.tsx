"use client";

import Image from "next/image";

export default function ProfileImage({
  image,
  alt,
  className,
  height,
  width,
}: {
  image: { src: string; date: number } | null;
  alt: string;
  className: string;
  height: number;
  width: number;
}) {
  return (
    <Image
      src={image?.src || "/profile.png"}
      alt={alt}
      className={className}
      height={height}
      width={width}
    />
  );
}
