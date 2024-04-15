import React from "react";
export default function Footer() {
  return (
    <footer className="flex items-center justify-between sm:justify-evenly px-2 py-6 text-sm">
      <p className="opacity-70">
        Copyright MDM &copy; {new Date().getFullYear()}
      </p>
      <p className="opacity-70">All Rights Reserved</p>
    </footer>
  );
}
