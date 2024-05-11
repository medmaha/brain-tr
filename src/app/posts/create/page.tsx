import { Metadata } from "next";
import React from "react";
import ImageForm from "./components/photo/ImageForm";
import CreateVideo from "./components/video/CreateVideo";
import AudioForm from "./components/audio/AudioForm";

export const metadata: Metadata = {
  title: "Post Create | MDM",
  description: "Create Post",
};

export default async function Page(props: PageProps) {
  const searchParams = props.searchParams;

  const postType = getPostType(searchParams.type as FileType);

  if (postType === "video")
    return (
      <div className="">
        <CreateVideo />
      </div>
    );

  if (postType === "image")
    return (
      <div className="min-h-screen pt-[25px]">
        <ImageForm file_type={getPostType(searchParams.type as FileType)} />
      </div>
    );

  if (postType === "audio")
    return (
      <div className="min-h-screen pt-[25px]">
        <AudioForm />
      </div>
    );

  return postType;
}

function getPostType(type?: FileType) {
  const defaultType: FileType = "image";
  const validTypes: Array<FileType> = ["image", "video", "audio", "other"];
  for (const validType of validTypes) {
    if (type?.toLowerCase() === validType) {
      return validType;
    }
  }
  return defaultType;
}
