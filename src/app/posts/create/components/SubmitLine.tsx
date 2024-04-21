"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormStatus } from "react-dom";

type Props = {
  data: Map<string, string | number>;
};

export default function SubmitLine(props: Props) {
  const router = useRouter();
  const { pending } = useFormStatus();

  const cancel = async () => {};

  return (
    <div className="flex justify-evenly flex-wrap items-center pt-4 gap-4 max-w-[610px] mx-auto">
      <button
        type="submit"
        disabled={pending}
        className="disabled:opacity-50 pointer-events-none group-valid:pointer-events-auto group-valid:opacity-100 opacity-50 min-w-[200px] sm:order-last text-sm disabled:pointer-events-none p-2 bg-sky-500 hover:bg-sky-500/90 rounded-md"
      >
        Submit Post
        {pending && <Loader2 className="animate-spin w-4 h-4 stroke-[3px]" />}
      </button>
      <button
        type="button"
        disabled={pending}
        className="disabled:opacity-40 min-w-[200px] text-sm disabled:pointer-events-none p-2 bg-gray-500 hover:bg-gray-500/90 rounded-md"
      >
        Cancel Post
        {pending && <Loader2 className="animate-spin w-4 h-4 stroke-[3px]" />}
      </button>
    </div>
  );
}
