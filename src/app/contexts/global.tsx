"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AudioPLayerProps from "./AudioPlayer";

type GlobalContextProviderProps = {
  user: AuthUser | null;
  children: React.ReactNode;
};

// prettier-ignore;
export default function GlobalContextProvider(
  props: GlobalContextProviderProps
) {
  const [user, setUser] = React.useState(props.user);
  const pathname = usePathname();
  const [player, setPLayer] = React.useState<any>();
  const activeAudio = React.useRef<{ id: string; audio: HTMLAudioElement }>(
    {} as any
  );

  useEffect(() => {
    if (activeAudio.current.audio) {
      setPLayer(!activeAudio.current.audio.paused);
      activeAudio.current.audio.pause();
    }
  }, [pathname]);

  function setActiveAudio(_audio: HTMLAudioElement) {
    activeAudio.current = {
      id: _audio.id,
      audio: _audio,
    };
    setPLayer(!activeAudio.current.audio.paused);
  }
  function getActiveAudio(id?: string) {
    if (id && activeAudio.current.id === id) {
      return activeAudio.current.audio;
    }

    if (id) return undefined;

    return activeAudio.current.audio;
  }

  function updateUser(_user: AuthUser) {}

  return (
    <GlobalContext.Provider
      value={{ user, updateUser, setActiveAudio, getActiveAudio }}
    >
      {props.children}
      {player && (
        <>
          <div className="z-10 fixed bottom-4 md:bottom-8 md:left-4 sm:max-w-[300px] w-full p-1">
            <div className="card border md:border-none shadow-lg p-4  rounded-md">
              <AudioPLayerProps
                author={user! as any}
                title={"Viby"}
                objectID="123"
                audio={getActiveAudio()}
                src={activeAudio.current?.audio?.src}
              />
            </div>
          </div>

          <div className="py-12 block w-full"></div>
        </>
      )}
      <Toaster
        toastOptions={{ duration: 5000 }}
        containerClassName="w-full"
        containerStyle={{
          maxWidth: "600px",
          margin: "0 auto",
          width: "100%",
          textAlign: "center",
        }}
      ></Toaster>
    </GlobalContext.Provider>
  );
}

type GlobalContextType = {
  user: AuthUser | null;
  updateUser: (user: AuthUser) => void;
  getActiveAudio: (id: string) => HTMLAudioElement | undefined;
  setActiveAudio: (audio: HTMLAudioElement, id: string) => void;
};

export const GlobalContext = React.createContext({} as GlobalContextType);
