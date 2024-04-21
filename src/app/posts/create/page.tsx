import { Metadata } from "next";
import React from "react";
import Form from "./Form";
import CreateVideo from "./components/CreateVideo";

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

  return (
    <div className="min-h-screen pt-[100px]">
      <Form file_type={getPostType(searchParams.type as FileType)} />
    </div>
  );
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
