"use client";
import { createPost } from "./actions";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import ImageFile from "./components/ImageFile";
import Hashtags from "./components/Hashtags";
import { Loader2 } from "lucide-react";

type Props = {
  file_type: FileType;
};

export default function Form({ file_type }: Props) {
  const router = useRouter();
  async function handleSubmit(formData: FormData) {
    if (!validateFormData(formData)) {
      return;
    }
    const results = await createPost(formData);
    if (results.success && typeof results) {
      if (results.slug) return router.replace("/posts/" + results.slug);
      return router.push("/posts");
    }
    alert(results.message);
  }

  return (
    <div className="max-w-[550px] mx-auto card shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold mb-6 md:mb-4 text-center">
        Post a {file_type === "image" ? "Image" : "Video"}
      </h2>
      <form
        action={handleSubmit}
        className="text-sm space-y-6 md:space-y-4 group"
      >
        <input hidden name="file_type" defaultValue={file_type} />

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
        {file_type === "image" && <ImageFile />}
        <Hashtags />
        {/* {file_type === "video" && <VideoFile />} */}

        <div className="flex justify-center mt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

function validateFormData(formData: FormData) {
  return true;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="inline-flex gap-2 items-center disabled:group-valid:animate-pulse group-valid:opacity-100 opacity-50 group-valid:pointer-events-auto pointer-events-none bg-sky-400 hover:bg-sky-500 text-black font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
      type="submit"
    >
      {pending ? "Creating" : "Create Post"}
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
    </button>
  );
}
