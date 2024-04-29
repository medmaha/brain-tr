"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React, { useMemo } from "react";

type Props = {
  href: string;
  isButton?: boolean;
  children: React.ReactNode;
};

export default function NavLink(props: Props) {
  const segment = useSelectedLayoutSegment();

  const target = useMemo(() => {
    if (!segment) return "/";
    return segment;
  }, [segment]);

  return (
    <Link
      href={props.href}
      className={`flex items-center space-x-2 transition-all ${
        target === props.href && !props.isButton
          ? "text-sky-500 font-semibold"
          : !props.isButton && "hover:text-sky-600"
      }`}
    >
      {props.children}
    </Link>
  );
}
