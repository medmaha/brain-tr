"use client";

import { Plus, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const iconSize = 30;

type Props = {
  user: AuthUser;
};

export default function FloatingButton(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, toggleOpen] = useState(false);

  const navigate = (href: string) => {
    router.push(href);
    toggleOpen(false);
  };

  if (pathname.includes("auth")) return <></>;

  return (
    <div className="fixed bottom-[6rem] sm:bottom-[4rem] right-6 md:right-8 z-10">
      <div
        className={`${
          isOpen
            ? "bg-sky-400 dark:bg-stone-900 dark:shadow dark:shadow-sky-500 p-1 pb-4 rounded shadow"
            : ""
        }`}
      >
        {isOpen && <FloatingContent navigate={navigate} />}

        <div className="flex items-center justify-center">
          <button
            onClick={() => toggleOpen((p) => !p)}
            className={`ring-1 ring-offset-2  p-2 rounded-full shadow ${
              isOpen
                ? "bg-red-400 ring-red-400"
                : "ring-sky-400 bg-sky-400 dark:bg-stone-900"
            }`}
          >
            {isOpen ? (
              <X
                className="text-white"
                width={iconSize - 10}
                height={iconSize - 10}
              />
            ) : (
              <Plus width={iconSize} height={iconSize} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatingContent({ navigate }: any) {
  return (
    <div className="mb-4">
      <ul className="">
        <li
          onClick={() => navigate("/posts/create")}
          className="p-1.5 rounded flex justify-between space-x-2 hover:bg-sky-100 dark:hover:bg-stone-800 cursor-pointer"
        >
          <span className="font-bold">Post</span>
          <span>+</span>
        </li>
        <li
          onClick={() => navigate("/posts/create?type=video")}
          className="p-1.5 rounded flex justify-between space-x-2 hover:bg-sky-100 dark:hover:bg-stone-800 cursor-pointer"
        >
          <span className="font-bold">Video</span>
          <span>+</span>
        </li>
        <li className="p-1.5 rounded flex justify-between space-x-2 hover:bg-sky-100 dark:hover:bg-stone-800 cursor-pointer">
          <span className="font-bold">Music</span>
          <span>+</span>
        </li>
        <li className="p-1.5 rounded flex justify-between space-x-2 hover:bg-sky-100 dark:hover:bg-stone-800 cursor-pointer">
          <span className="font-bold">Settings</span>
          <span>+</span>
        </li>
      </ul>
    </div>
  );
}
