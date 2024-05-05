"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type SIZE = "sm" | "md" | "lg";

type Props = {
  size?: SIZE;
  text?: string | true;
};

const iconStyles = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};
const btnStyles = {
  sm: "text-xs py-1 px-1.5",
  md: "text-sm py-1.5 px-2",
  lg: "text-base py-2 px-2.5",
};

export default function BackButton({ size = "sm", text }: Props) {
  const router = useRouter();

  const navigate = () => {
    // FIXME: navigate back to the application even if the user is on the index page
    router.back();
  };

  return (
    <button
      title="Go Back"
      onClick={navigate}
      className={`rounded-full inline-flex items-center gap-1 dark:hover:bg-gray-500/30 transition text-xs ${btnStyles[size]}`}
    >
      <ArrowLeft className={`${iconStyles[size]}`} />
      {text !== true && <span>{text}</span>}
      {text === true && <span>Back</span>}
    </button>
  );
}
