import React from "react";
import { Camera, Music, MessageSquare, Home } from "lucide-react";
import Link from "next/link";
import NavLink from "./NavLink";

export default function Navbar() {
  return (
    <nav className="p-4 flex items-center justify-between shadow">
      <a href="/" className="text-xl">
        MDM
      </a>
      <ul className="flex items-center gap-4 lg:gap-8 justify-end">
        <NavLink href="/">
          <Home size={24} />
          <span className="hidden md:inline-block">Home</span>
        </NavLink>
        <NavLink href="/photoes">
          <Camera size={24} />
          <span className="hidden md:inline-block">Photos</span>
        </NavLink>
        <NavLink href="/music">
          <Music size={24} />
          <span className="hidden md:inline-block">Music</span>
        </NavLink>
        <NavLink href="/messages">
          <MessageSquare size={24} />
          <span className="hidden md:inline-block">Messages</span>
        </NavLink>
      </ul>
    </nav>
  );
}
