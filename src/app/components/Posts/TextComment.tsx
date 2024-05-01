"use client";
import { Forward, Pause, Play, ThumbsUp, Volume2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
};

export default function TextComment({ text }: Props) {
  return (
    <>
      <div className="dark:bg-black/20 bg-gray-400 p-0.5 px-1 rounded-full w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex items-center gap-2">
            <p className="text-sm p-2">{text || "No content provided"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600">
              <ThumbsUp width={18} height={18} />
            </button>
            <button className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600">
              <Forward width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
