"use client";
import {
  HelpCircle,
  LogOut,
  Settings,
  Settings2,
  User,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import Logout from "./Logout";

type Props = {
  user: AuthUser;
};

export default function UserProfile(props: Props) {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [logout, setLogout] = React.useState(false);
  const [dropdown, setDropdown] = React.useState(false);

  const toggleLogout = (value: boolean) => {
    setLogout(value);
  };

  useEffect(() => {
    const onClick = (event: any) => {
      if (!dropdown) return;
      if (event.target === dropdownRef.current) return;
      if (dropdownRef.current?.contains(event.target)) return;
      setDropdown(false);
    };
    document.onclick = onClick;
    return () => {
      document.onclick = null;
    };
  }, [dropdown]);

  const toggleDropdown = () => {
    setDropdown((p) => !p);
  };

  return (
    <>
      <div className="relative account-dropdown" ref={dropdownRef}>
        {!props.user?.avatar && (
          <button
            onClick={toggleDropdown}
            className="border p-2 rounded-full hover:shadow"
          >
            <User width={20} height={20} />
          </button>
        )}
        {props.user?.avatar && (
          <button onClick={toggleDropdown} className="w-[40px] h-[40px]">
            <Image
              alt="user avatar"
              height={40}
              width={40}
              className="border rounded-full hover:shadow w-full h-full"
              // src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
              src={props.user?.avatar}
            />
          </button>
        )}
        {dropdown && (
          <div className="absolute z-10 top-12 right-0 card rounded overflow-hidden rounded-t-md shadow border">
            <ul className="space-y-1 text-sm">
              <li className="border-b w-max px-2 pb-2 pt-1 min-w-[200px]">
                <p className="text-sm text-center">{props.user?.name}</p>
              </li>
              {props.user?.userType ? (
                <>
                  <li className="inline-block w-full">
                    <Link
                      onClick={() => setDropdown(false)}
                      className="transition w-full inline-flex justify-between hover:bg-sky-500 p-2 px-2"
                      href={`/${props.user.username}`}
                    >
                      Account
                      <User2 width={16} height={16} />
                    </Link>
                  </li>
                  <li className="inline-block w-full">
                    <Link
                      onClick={() => setDropdown(false)}
                      className="transition w-full inline-flex justify-between hover:bg-sky-500 p-2 px-2"
                      href="#"
                    >
                      <span>Settings</span>
                      <Settings width={16} height={16} />
                    </Link>
                  </li>
                  <li className="inline-block w-full">
                    <Link
                      onClick={() => setDropdown(false)}
                      className="transition w-full inline-flex justify-between hover:bg-sky-500 p-2 px-2"
                      href="/help"
                    >
                      Help (Viby)
                      <HelpCircle width={16} height={20} />
                    </Link>
                  </li>
                  <li className="inline-block w-full">
                    <button
                      type="button"
                      onClick={() => {
                        toggleDropdown();
                        toggleLogout(true);
                      }}
                      className="transition w-full inline-flex justify-between hover:bg-sky-500 p-2 px-2"
                    >
                      Logout
                      <LogOut width={16} height={20} />
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="inline-block w-full">
                    <Link
                      onClick={() => setDropdown(false)}
                      className="transition w-full inline-flex justify-between hover:bg-sky-500 p-2 px-2"
                      href={`/auth/setup`}
                    >
                      Setup Account
                      <Settings2 width={16} height={16} />
                    </Link>
                  </li>
                  <li className="inline-block w-full">
                    <Link
                      onClick={() => setDropdown(false)}
                      className="transition w-full inline-flex justify-between hover:bg-sky-500 p-2 px-2"
                      href="/help"
                    >
                      Help (Viby)
                      <HelpCircle width={16} height={20} />
                    </Link>
                  </li>
                  <li className="inline-block w-full">
                    <button
                      type="button"
                      onClick={() => {
                        toggleDropdown();
                        toggleLogout(true);
                      }}
                      className="transition w-full inline-flex justify-between hover:bg-sky-500 p-2 px-2"
                    >
                      Logout
                      <LogOut width={16} height={20} />
                    </button>
                  </li>{" "}
                </>
              )}
            </ul>
            <footer className="text-center border-t opacity-70 p-2 text-xs">
              &copy; Copyright {new Date().getFullYear()}
            </footer>
          </div>
        )}
      </div>

      {logout && (
        <>
          <Logout user={props.user} toggleLogout={toggleLogout} />
        </>
      )}
    </>
  );
}
