import React from "react";

type Props = {
  publisher: string;
  appName: string;
};

export default function Footer(props: Props) {
  return (
    <footer className="container max-w-[900px] mx-auto">
      <div className="flex items-center flex-col gap-2 justify-center sm:flex-row sm:justify-between px-2 py-6 text-sm">
        <p className="opacity-70">
          Copyright &copy; {""}
          <a
            className="underline underline-offset-4 hover:text-sky-500"
            href="https://portfolio-mahamed.vercel.com"
          >
            {props.publisher}
          </a>{" "}
          {new Date().getFullYear()}
        </p>
        <p className="opacity-70">All Rights Reserved</p>
      </div>
    </footer>
  );
}
