"use client";
import { createPost } from "../../actions";
import { useRouter } from "next/navigation";
import ImagePicker from "./ImagePicker";
import Hashtags from "../Hashtags";
import SubmitLine from "../SubmitLine";

type Props = {
  file_type: FileType;
};

export default function ImageForm({ file_type }: Props) {
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
        className="text-sm space-y-6 md:space-y-4 group/form"
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
        <ImagePicker />
        <Hashtags />
        {/* {file_type === "video" && <VideoFile />} */}

        <div className="flex justify-center mt-4">
          <SubmitLine onSubmitText="Submitting..." submitText="Submit Post" />
        </div>
      </form>
    </div>
  );
}

function validateFormData(formData: FormData) {
  return true;
}
