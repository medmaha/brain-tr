import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function InputField({ ...props }: InputProps) {
  return <input {...props} className="input p-2 rounded w-full" />;
}
