import React from "react";
export default function Footer() {
  return (
    <footer className="flex items-center flex-col gap-2 justify-center sm:flex-row sm:justify-between lg:justify-around px-2 py-6 text-sm">
      <p className="opacity-70">All Rights Reserved</p>
      <p className="opacity-70">
        Copyright &copy; {""}
        <a
          className="underline underline-offset-4 hover:text-sky-500"
          href="https://portfolio-mahamed.vercel.com"
        >
          Intra Software
        </a>{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
