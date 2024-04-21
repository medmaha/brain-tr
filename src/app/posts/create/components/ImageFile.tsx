import Image from "next/image";
import { useRef, useState } from "react";

export default function ImageFile() {
  const [image, setImage] = useState<File>();
  const elementRef = useRef<HTMLInputElement>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (isValidFile(file)) {
        setImage(file);
      }
      return;
    }
    setImage(undefined);
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
      {image && (
        <div className="block mx-auto">
          <Image
            src={URL.createObjectURL(image)}
            width={600}
            height={500}
            alt="Post Image"
          />
        </div>
      )}
      <div
        className={`flex items-center gap-4 ${
          image ? "shadow sbg-white p-2 py-3 rounded-md card" : ""
        }}`}
      >
        <button
          type="button"
          onClick={() => elementRef.current?.click()}
          className={`py-1 px-2 rounded-md  ${
            image
              ? "bg-white dark:bg-stone-900 shadow shadow-sky-500"
              : "border bg-gray-600 text-white"
          }`}
        >
          {!image ? "Chooose Image" : "Change Image"}
        </button>
        {image && (
          <p className="text-sm opacity-65">
            {image.name || "No image selected"}
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
