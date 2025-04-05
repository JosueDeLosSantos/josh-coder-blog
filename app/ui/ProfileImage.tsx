"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/actions";

export default function ProfileImage({
  src,
  alt,
  className,
  height,
  width,
}: {
  src: string | null | undefined;
  alt: string;
  className: string;
  height: number;
  width: number;
}) {
  const [imageUrl, setImageUrl] = useState<string>("/profile.png");
  useEffect(() => {
    (async () => {
      const image = await getImageUrl(src);
      setImageUrl(image);
    })();
  }, []);
  return (
    <Image
      src={imageUrl}
      alt={alt}
      className={className}
      height={height}
      width={width}
    />
  );
}
