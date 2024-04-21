import { useRef, useState } from "react";

export default function AudioFile() {
  const [audio, setAudio] = useState<File>();
  const elementRef = useRef<HTMLInputElement>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (isValidFile(file)) {
        setAudio(file);
      }
      return;
    }
    setAudio(undefined);
  }

  function isValidFile(file: File) {
    return true;
  }

  return (
    <div className="">
      <label
        className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
        htmlFor="audio"
      >
        Photo{" "}
        <span title="required" className="text-sky-500 font-semibold">
          *
        </span>
      </label>
      {audio && (
        <div className="block mx-auto">
          {/* <Audio
              src={URL.createObjectURL(audio)}
              width={600}
              height={500}
              alt="Post Audio"
            /> */}
        </div>
      )}
      <div
        className={`flex items-center gap-4 ${
          audio ? "shadow sbg-white p-2 py-3 rounded-md card" : ""
        }}`}
      >
        <button
          type="button"
          onClick={() => elementRef.current?.click()}
          className={`py-1 px-2 rounded-md  ${
            audio
              ? "bg-white dark:bg-stone-900 shadow shadow-sky-500"
              : "border bg-gray-600 text-white"
          }`}
        >
          {!audio ? "Chooose Audio" : "Change Audio"}
        </button>
        {audio && (
          <p className="text-sm opacity-65">
            {audio.name || "No audio selected"}
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
        accept="audio/png, audio/jpeg, audio/gif"
        id="audio"
        name="file"
      />
    </div>
  );
}
