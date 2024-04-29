"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

type GlobalContextProviderProps = {
  user: AuthUser | null;
  children: React.ReactNode;
};

// prettier-ignore
export default function GlobalContextProvider(props: GlobalContextProviderProps) {
  const [user, setUser] = React.useState(props.user);

  function updateUser(_user: AuthUser) {}

  return (
    <GlobalContext.Provider value={{ user, updateUser }}>
      {props.children}
      <Toaster 
      toastOptions={{ duration: 5000 }} 
      containerClassName="w-full" 
      />
    </GlobalContext.Provider>
  );
}

type GlobalContextType = {
  user: AuthUser | null;
  updateUser: (user: AuthUser) => void;
};

export const GlobalContext = React.createContext({} as GlobalContextType);
