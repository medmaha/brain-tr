import React from "react";
import { Camera, Music, MessageSquare, Home } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 flex items-center justify-between shadow">
      <a href="/" className="text-xl">
        MDM
      </a>
      <ul className="flex items-center gap-4 justify-end">
        <Link href="/" className="flex items-center space-x-2">
          <Home size={24} />
          <span className="hidden md:inline-block">Home</span>
        </Link>
        <Link href="#" className="flex items-center space-x-2">
          <Camera size={24} />
          <span className="hidden md:inline-block">Photos</span>
        </Link>
        <Link href="#" className="flex items-center space-x-2">
          <Music size={24} />
          <span className="hidden md:inline-block">Music</span>
        </Link>
        <Link href="#" className="flex items-center space-x-2">
          <MessageSquare size={24} />
          <span className="hidden md:inline-block">Messages</span>
        </Link>
      </ul>
    </nav>
  );
}
