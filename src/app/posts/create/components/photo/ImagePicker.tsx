import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { resizeImage } from "./utils";

export default function ImagePicker() {
  const [file, setFile] = useState<File>();
  const [loading, toggleLoading] = useState(false);
  const elementRef = useRef<HTMLInputElement>(null);
  const toastId = useRef<any>();

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    toast.dismiss(toastId.current);
    const file = event.target.files?.[0];
    if (file) {
      const isValid = isValidFile(file);
      if (isValid) {
        const callback = (file: File | null) => {
          if (file) {
            toggleLoading(false);
            return setFile(file);
          }
          toastId.current = toast.error(
            "An error occurred while processing your image",
            { duration: 5_000 }
          );
          toggleLoading(false);
        };

        toggleLoading(true);
        resizeImage(file, callback);
        return;
      }
      toastId.current = toast.error(
        "This file is not a valid image accepted by Viby",
        { duration: 5_000 }
      );
      return;
    }
    setFile(undefined);
  }

  function isValidFile(file: File) {
    return true;
  }

  return (
    <div className="">
      <label
        className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
        htmlFor="image"
      >
        Photo{" "}
        <span title="required" className="text-sky-500 font-semibold">
          *
        </span>
      </label>
      {file && (
        <div className="block mx-auto">
          <Image
            src={URL.createObjectURL(file)}
            width={550}
            height={450}
            alt="Post Image"
          />
        </div>
      )}
      <div
        className={`flex items-center gap-4 ${
          file ? "shadow sbg-white p-2 py-3 rounded-md card" : ""
        }}`}
      >
        <button
          type="button"
          disabled={loading}
          onClick={() => elementRef.current?.click()}
          className={`py-1 px-2 rounded-md  ${
            file
              ? "bg-white dark:bg-stone-900 shadow shadow-sky-500"
              : "border bg-gray-600 text-white"
          }`}
        >
          {!file ? "Choose Image" : "Change Image"}
        </button>
        {file && (
          <p className="text-sm opacity-65">
            {file.name || "No image selected"}
          </p>
        )}
        {loading && (
          <p className="text-xs animate-pulse text-primary">
            Processing your image...
          </p>
        )}
      </div>
      <input
        hidden
        ref={elementRef}
        onChange={handleInputChange}
        className="shadow appearance-none file:border-none file:rounded file:px-2 file:py-1 file:valid:shadow file:mr-4 file:valid:my-2 file:valid:shadow-sky-500 file:valid:bg-white  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="file"
        required
        accept="image/png, image/jpeg, image/gif"
        id="image"
        name="file"
      />
    </div>
  );
}
