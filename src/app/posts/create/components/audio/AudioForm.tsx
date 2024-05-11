"use client";
import { useEffect, useRef, useState } from "react";
import Hashtags from "../Hashtags";
import SubmitLine from "../SubmitLine";
import AudioPlayer from "./AudioPlayer";
import toast from "react-hot-toast";
import { createPost } from "../../actions";
import { useRouter } from "next/navigation";

export default function AudioForm() {
  const [audio, setAudio] = useState<File>();
  const toastId = useRef<any>();
  const router = useRouter();

  useEffect(() => {
    return () => {
      toast.dismiss(toastId.current);
    };
  }, []);

  function isValidFile(file: File) {
    return !!file;
  }

  async function submitAudio(formData: FormData) {
    toast.dismiss(toastId.current);
    if (!audio) {
      toastId.current = toast.error("Audio is required to make a post");
      return;
    }

    if (!isValidFile(audio)) {
      toastId.current = toast.error("Audio is required to make a post");
      return;
    }

    const caption = formData.get("caption")?.toString();

    if (!caption || caption.length < 1) {
      toastId.current = toast.error(
        "Caption is required at least 3 characters minimum"
      );
      return;
    }
    const _formData = new FormData();
    _formData.append("caption", caption);
    _formData.append("file_type", "audio");
    _formData.append("file", audio);
    _formData.append("hashtags", formData.get("hashtags")?.toString() || "");
    _formData.append(
      "media_name",
      formData.get("media_name")?.toString() || ""
    );
    const response = await createPost(_formData);

    if (response.success) {
      toast.success(
        response.message || "Your post has been successfully created!",
        { duration: 5_000 }
      );

      return router.replace(
        `/posts${response.slug ? `/${response.slug}` : ""}`
      );
    }

    toast.error(response.message || "Error! failed to create posts", {
      duration: 5_000,
    });
  }

  return (
    <div className="max-w-[550px] mx-auto card shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 md:mb-4 text-center">
        Post a Audio
      </h2>
      <form
        action={submitAudio}
        className="text-sm space-y-6 md:space-y-4 group/form"
      >
        <input hidden name="file_type" defaultValue={"audio"} />

        {/* CAPTION */}
        <div className=" group">
          <textarea
            autoFocus
            required
            name="caption"
            minLength={5}
            maxLength={500}
            placeholder="Write a caption..."
            className="!border-b bg-transparent invalid:focus:border-red-400 rounded-b-none min-h-[38px] h-[38px] max-h-[250px] appearance-none w-full py-2 px-1 dark:placeholder:text-gray-300 dark:text-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="caption"
          ></textarea>
        </div>

        <Hashtags />
        {/* {file_type === "video" && <VideoFile />} */}

        <AudioPlayer setAudio={setAudio} />

        <div className="flex justify-center mt-4">
          <SubmitLine onSubmitText="Submitting..." submitText="Submit Audio" />
        </div>
      </form>
    </div>
  );
}
