import React from "react";
import { Camera, Music, MessageSquare, Home } from "lucide-react";
import NavLink from "./NavLink";
import UserProfile from "./UserProfile";
import NavbarContainer from "./Container";

type Props = {
  appName: string;
  user: AuthUser | null;
};

export default function Navbar(props: Props) {
  return (
    <NavbarContainer user={props.user} appName={props.appName}>
      <nav className="p-4 flex items-center justify-between max-w-[1000px] mx-auto">
        <a
          href="/"
          className="text-xl font-extrabold italic bg-clip-text bg-gradient-to-t from-sky-500 to-sky-600"
        >
          {props.appName}
        </a>
        {!!props.user?.userType ? (
          <ul className="flex items-center gap-4 lg:gap-8 justify-end text-xs">
            <NavLink href="/">
              <Home size={24} />
            </NavLink>
            <NavLink href="/photoes">
              <Camera size={24} />
            </NavLink>
            <NavLink href="/music">
              <Music size={24} />
            </NavLink>
            <NavLink href="/messages">
              <MessageSquare size={24} />
            </NavLink>
            <UserProfile user={props.user} />
          </ul>
        ) : (
          props.user && (
            <ul className="flex items-center gap-4 lg:gap-8 justify-end">
              <NavLink href="">
                <b> @{props.user?.username}</b>
              </NavLink>
              {props.user && <UserProfile user={props.user} />}
            </ul>
          )
        )}
        {!props.user && (
          <ul className="flex items-center gap-4 lg:gap-8 justify-end text-sm">
            <NavLink href="/auth/login" isButton>
              <button className="bg-sky-500 hover:bg-sky-500/90 rounded-md p-2 px-4">
                Sign In
              </button>
            </NavLink>
            <NavLink href="/auth/register" isButton>
              <button className="bg-gray-500 hover:bg-gray-500/90 text-white hover:text-white rounded-md p-2 px-4">
                Register
              </button>
            </NavLink>
          </ul>
        )}
      </nav>
    </NavbarContainer>
  );
}
