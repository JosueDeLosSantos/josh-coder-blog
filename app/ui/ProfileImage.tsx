"use client";

import Image from "next/image";

export default function ProfileImage({
  src,
  alt,
  className,
  height,
  width,
}: {
  src: string | null;
  alt: string;
  className: string;
  height: number;
  width: number;
}) {
  return (
    <Image
      src={src || "/profile.png"}
      alt={alt}
      className={className}
      height={height}
      width={width}
    />
  );
}
