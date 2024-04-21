"use client";
import React from "react";

export default function Page(props: PageProps) {
  const { slug } = props.params;

  return (
    <p className="mb-4 card mt-2 p-2 px-4 shadow w-[400px] mx-auto rounded-xl">
      <b className="pr-2">Slug:</b> {slug}
    </p>
  );
}
