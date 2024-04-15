"use client";
import { Plus } from "lucide-react";
import React, { useMemo } from "react";

export default function FloatingButton() {
  const iconSize = useMemo(() => {
    return 36;
  }, []);

  return (
    <div className="fixed bottom-[4rem] right-3 z-10">
      <button className="bg-sky-400 ring-1 ring-offset-2 ring-sky-400 p-2 rounded-full shadow">
        <Plus width={iconSize} height={iconSize} />
      </button>
    </div>
  );
}
