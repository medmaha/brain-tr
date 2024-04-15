import React from "react";
import { PageProps } from "../../../../.next/types/app/page";

export default function Page(props: PageProps) {
  const { slug } = props.params;
  return (
    <div>
      {/*  */}
      Slug {slug}
    </div>
  );
}
