"use client";

import React, { useState, useRef, useEffect, use } from "react";
import { uploadFile } from "@/lib/actions";
import ImageUploading, { ImageListType } from "react-images-uploading";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "@/utils/canvasPreview";
import { useDebounceEffect } from "@/utils/useDebounceEffect";
import "react-image-crop/dist/ReactCrop.css";
import { AiOutlineEdit } from "react-icons/ai";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function FotoUploader({ message }: { message: string }) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(
    null as unknown as HTMLCanvasElement
  );
  const imgRef = useRef<HTMLImageElement>(null as unknown as HTMLImageElement);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [fileName, setFileName] = useState("");
  const [images, setImages] = useState<ImageListType>([]);
  const [cropSectionVisibility, setCropSectionVisibility] = useState("none");
  const [profileImage, setProfileImage] = useState(null as unknown as File);
  const aspect = 1 / 1;

  useEffect(() => {
    async function uploadProfileImage() {
      if (profileImage) {
        const response = await uploadFile(profileImage);
        console.log(response);
      }
    }
    uploadProfileImage();
  }, [profileImage]);

  function onProfilePicChange(file?: File) {
    if (file) {
      setProfileImage(file);
    } else {
      console.log("No file");
    }
  }

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
    setImgSrc(imageList[0]["data_url"]);
    if (imageList[0].file) {
      setFileName(imageList[0].file.name);
    }
    setCrop(undefined); // Makes crop preview update between images.

    if (cropSectionVisibility === "none") setCropSectionVisibility("block");
  };

  // MARK: onImageLoad
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  // MARK: onDownloadCropClick
  async function onCropSelected() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({
      type: "image/jpeg",
      quality: 1,
    });

    const file = new File([blob], `${fileName}`);

    setCropSectionVisibility("none");
    onProfilePicChange(file);
  }

  function onRemoveCrop() {
    setCropSectionVisibility("none");
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  // MARK: render
  return (
    <div>
      <ImageUploading value={images} onChange={onChange} dataURLKey="data_url">
        {({ onImageUpload, isDragging, dragProps }) => (
          <div>
            <BlogImgUploadBtn
              isDragging={isDragging}
              message={message}
              dragProps={{ ...dragProps }}
              onImageUpload={onImageUpload}
            />
            <ImgCrop
              cropSectionVisibility={cropSectionVisibility}
              aspect={aspect}
              imgSrc={imgSrc}
              imgRef={imgRef}
              previewCanvasRef={previewCanvasRef}
              completedCrop={completedCrop}
              crop={crop}
              onRemoveCrop={onRemoveCrop}
              setCrop={setCrop}
              setCompletedCrop={setCompletedCrop}
              onCropSelected={onCropSelected}
              onImageLoad={onImageLoad}
            />
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

interface ImgUploadBtnProps {
  isDragging: boolean;
  message: string;
  dragProps: {
    onDrop: (e: React.DragEvent<HTMLElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLElement>) => void;
    onDragStart: (e: React.DragEvent<HTMLElement>) => void;
  };
  onImageUpload: () => void;
}

const BlogImgUploadBtn: React.FC<ImgUploadBtnProps> = ({
  isDragging,
  message,
  dragProps,
  onImageUpload,
}) => {
  return (
    <div className="mx-auto w-full text-start">
      <button
        className={
          isDragging
            ? "block text-textMild max-md:text-sm md:text-base 2xl:text-lg mx-auto"
            : "block text-textLight max-md:text-sm md:text-base 2xl:text-lg mx-auto"
        }
        onClick={(e) => {
          e.preventDefault();
          onImageUpload();
        }}
        {...dragProps}
      >
        <div className="flex items-center">
          <AiOutlineEdit className="text-lg" />
          {message}
        </div>
      </button>
    </div>
  );
};

interface ImgCropPros {
  cropSectionVisibility: string;
  aspect: number;
  imgSrc: string;
  imgRef: React.RefObject<HTMLImageElement>;
  previewCanvasRef: React.RefObject<HTMLCanvasElement>;
  completedCrop: PixelCrop | undefined;
  crop: Crop | undefined;
  onRemoveCrop: () => void;
  setCrop: React.Dispatch<React.SetStateAction<Crop | undefined>>;
  setCompletedCrop: React.Dispatch<React.SetStateAction<PixelCrop | undefined>>;
  onCropSelected: () => void;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const ImgCrop: React.FC<ImgCropPros> = ({
  cropSectionVisibility,
  aspect,
  imgSrc,
  imgRef,
  previewCanvasRef,
  completedCrop,
  crop,

  onRemoveCrop,
  setCrop,
  setCompletedCrop,
  onCropSelected,
  onImageLoad,
}) => {
  return (
    <div
      style={{ display: `${cropSectionVisibility}` }}
      className="fixed left-0 top-0 h-screen w-full bg-[rgba(0,0,0,0.7)]"
    >
      <div
        style={{
          display: `${cropSectionVisibility}`,
        }}
        className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-5 max-sm:w-5/6 sm:w-[600px]"
      >
        <div
          style={{ display: `${cropSectionVisibility}` }}
          className="relative bottom-0 left-0 w-full"
        >
          <div className="flex justify-center">
            {!!imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minWidth={50}
                minHeight={50}
                circularCrop
              >
                <img
                  className="rounded-lg object-cover"
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </div>
          {!!completedCrop && (
            <div>
              {/* removes the hidden class to see crop preview. 
        This element can't be removed or the library will
        misbehave.*/}
              <div className="hidden">
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: "1px solid black",
                    objectFit: "contain",
                    width: "100%",
                    // width: completedCrop.width,
                    // height: completedCrop.height,
                  }}
                />
              </div>
              <div className="flex justify-center gap-2">
                <button
                  className="block mt-2 gap-2 rounded bg-purple-600 px-[1em] py-[0.5em] font-bold text-white hover:bg-purple-700 max-sm:text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onCropSelected();
                  }}
                >
                  Crop
                </button>
                <button
                  className="block mt-2 rounded border border-slate-400 bg-white px-[0.8em] py-[0.5em] font-bold text-slate-500 hover:bg-slate-100 max-sm:text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveCrop();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
