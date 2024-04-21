import { Loader2 } from "lucide-react";
import React from "react";

export default function PageLoader() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
    </div>
  );
}
