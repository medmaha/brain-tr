import React from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function TextareaField({ ...props }: Props) {
  return (
    <textarea
      {...props}
      className="input w-full rounded min-h-[100px] p-2"
    ></textarea>
  );
}
