"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="order-first hover:scale-125 transition-all inline-flex"
      title="Back"
    >
      <ArrowLeft size={24} />
    </button>
  );
}
