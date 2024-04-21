import React from "react";

export default function Hashtags() {
  return (
    <div className="">
      <label
        className="block text-gray-700 dark:text-gray-200 text-sm mb-2"
        htmlFor="image"
      >
        Hashtags
      </label>
      <input
        name="hashtags"
        placeholder="#hashtag1, #hashtag2, #hashtag3"
        className="input w-full py-2 px-3"
        type="text"
        id="hashtags"
      />
    </div>
  );
}
