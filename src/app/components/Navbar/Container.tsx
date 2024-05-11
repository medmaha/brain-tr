"use client";
import React, { ReactNode, useEffect, useRef } from "react";

type NavbarContainerProps = {
  appName: string;
  user: AuthUser | null;
  children: ReactNode;
};

export default function NavbarContainer(props: NavbarContainerProps) {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const observer = useRef<IntersectionObserver>();

  const callback: IntersectionObserverCallback = (entries) => {};

  useEffect(() => {
    // observer.current = new IntersectionObserver(callback);
  }, []);

  return <header ref={headerRef}>{props.children}</header>;
}
