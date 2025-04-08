"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/actions";
import { Session } from "next-auth";

export default function ProfileImage({
  session,
  userImage,
  alt,
  className,
  height,
  width,
}: {
  session?: Session | null;
  userImage?: string | null;
  alt: string;
  className: string;
  height: number;
  width: number;
}) {
  const [imageUrl, setImageUrl] = useState<string>("/profile.png");
  useEffect(() => {
    (async () => {
      if (session) {
        const image = await getImageUrl(session);
        if (image) setImageUrl(image);
      } else {
        const image = await getImageUrl(null, userImage);
        if (image) setImageUrl(image);
      }
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
