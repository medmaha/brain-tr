"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React, { useMemo } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: Props) {
  const segment = useSelectedLayoutSegment();

  const target = useMemo(() => {
    if (!segment) return "/";
    return segment;
  }, [segment]);

  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 transition-all ${
        target === href ? "text-sky-500 font-semibold" : "hover:text-sky-600"
      }`}
    >
      {children}
    </Link>
  );
}
