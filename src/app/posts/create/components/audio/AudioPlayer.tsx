"use client";
import { GlobalContext } from "@/app/contexts/global";
import { Pause, Play, Volume2Icon } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function AudioPlayer({ setAudio: setAudioMain }: any) {
  const [file, setFile] = useState<File>();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [playing, togglePlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const context = useContext(GlobalContext);

  const trackerIntervalRef = useRef<any>();

  useEffect(() => {
    return () => {
      clearInterval(trackerIntervalRef.current);
    };
  }, []);
  useEffect(() => {
    audio && setAudioMain(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  const setVolume = (volume: number) => {
    if (audio) audio.volume = volume;
  };

  const getVolume = () => {
    return Number(localStorage.getItem("_MediaVolume") || 0.5);
  };

  function formatAudioDuration(durationInSeconds: number) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  function setupAudio(_audio: HTMLAudioElement, _file: File) {
    clearInterval(trackerIntervalRef.current);
    const timeElement =
      containerRef.current?.querySelector("[data-audio-time]");
    const durationElement = containerRef.current?.querySelector(
      "[data-audio-duration]"
    );
    _audio.onplay = () => {
      togglePlaying(true);
      trackerIntervalRef.current = setInterval(() => {
        if (_audio.duration) {
          const width = (_audio.currentTime / _audio.duration) * 100;
          containerRef.current &&
            containerRef.current.style.setProperty(
              "--trackerWidth",
              `${width}%`
            );

          if (timeElement)
            timeElement.innerHTML = formatAudioDuration(_audio.currentTime);
          if (durationElement)
            durationElement.innerHTML = formatAudioDuration(_audio.duration);
        }
      }, 1000);
    };

    _audio.onpause = () => {
      clearInterval(trackerIntervalRef.current);
      togglePlaying(false);
    };
    _audio.onended = () => {
      clearInterval(trackerIntervalRef.current);
      togglePlaying(false);
      containerRef.current &&
        containerRef.current.style.setProperty("--trackerWidth", `100%`);

      if (timeElement) timeElement.innerHTML = _audio.duration.toFixed(2);
      if (durationElement)
        durationElement.innerHTML = _audio.duration.toFixed(2);
    };

    _audio.volume = getVolume();
    _audio.src = URL.createObjectURL(_file);
    _audio.play();
  }

  const selectAudio = () => {
    clearInterval(trackerIntervalRef.current);
    const input = document.createElement("input");
    input.accept = "audio/mp3,audio.wav,audio.wepm,audio/mpeg";
    input.type = "file";
    input.multiple = false;

    input.onchange = () => {
      if (input.files && input.files[0]) {
        audio?.pause();
        audio?.remove();
        const _audio = document.createElement("audio");
        const _file = input.files[0];

        setupAudio(_audio, _file);
        setFile(_file);
        setAudio(_audio);
        setAudioMain(_file);
      }
    };

    input.click();
  };

  const togglePlay = () => {
    if (playing) {
      audio?.pause();
      togglePlaying(false);
      return;
    }
    audio?.play();
    togglePlaying(true);
  };

  return (
    <div
      ref={containerRef}
      className="border rounded-lg shadow-lg overflow-hidden w-full"
      // @ts-ignore
      style={{ "--trackerWidth": "0%" }}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-max">
            <button
              onClick={togglePlay}
              disabled={!audio}
              type="button"
              className=" disabled:bg-transparent disabled:pointer-events-none disabled:opacity-10 bg-primary text-white rounded-full p-1.5 hover:bg-primary/90 transition-colors"
            >
              {playing ? <Pause /> : <Play />}
            </button>
          </div>
          <div className="min-w-full flex-1 block">
            {audio && (
              <>
                <input
                  required
                  name="media_name"
                  minLength={5}
                  className="font-semibold !border-none rounded outline-none bg-transparent p-0.5 mb-1 focus:text-sm w-full focus:outline focus:outline-1 focus:outline-gray-500/50"
                  defaultValue={audio.title || file?.name || "Unnamed file"}
                />

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  @{context.user?.username}
                </p>
              </>
            )}
            {!audio && (
              <>
                <button
                  onClick={selectAudio}
                  type="button"
                  className="bg-primary text-white p-2 rounded-md"
                >
                  Select Audio
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center w-max gap-4">
          <VolumeController
            callback={setVolume}
            disabled={!audio}
            defaultValue={audio?.volume}
          />
        </div>
      </div>
      <div className="px-6 py-4">
        <div
          dir="ltr"
          data-orientation="horizontal"
          aria-disabled="false"
          className="relative flex w-full bg-gray-500/50 rounded-full touch-none select-none items-center"
        >
          <div
            data-orientation="horizontal"
            className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
          >
            <span
              data-orientation="horizontal"
              className="absolute h-full bg-primary rounded-full transition-[width]"
              style={{ left: "0%", width: "var(--trackerWidth)" }}
            ></span>
          </div>
        </div>
        <input defaultValue="40" style={{ display: "none" }} />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-4">
          <span data-audio-time>-:--</span>
          <span data-audio-duration>-:--</span>
        </div>
      </div>

      {audio && (
        <div className="px-6 pb-6">
          <button
            onClick={selectAudio}
            type="button"
            className="bg-gray-600 text-white p-2 rounded-md"
          >
            Change Audio
          </button>
        </div>
      )}

      <input required name="audio_file" defaultValue={audio && "true"} hidden />
    </div>
  );
}

function VolumeController({ disabled, callback, defaultValue }: any) {
  return (
    <button
      type="button"
      className="group relative disabled:bg-transparent disabled:!pointer-events-none disabled:opacity-10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
      onClick={() => {}}
      title="Volume"
      disabled={disabled}
    >
      <Volume2Icon className="text-red" />
      <div
        itemID="volume"
        className="hidden absolute right-0 p-0 h-max group-hover:active:block group-focus:block bg-transparent"
      >
        <div className="p-3 border inline-flex items-center justify-centers h-max card rounded-full">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            className="stroke-primary m-0 border-none h-[3px] bg-primary outline-1 p-0.5"
            defaultValue={defaultValue?.toString() || "0.5"}
            onChange={(e) => {
              localStorage.setItem("_MediaVolume", e.target.value);
              if (callback) {
                callback(Number(e.target.value));
              }
            }}
          />
        </div>
      </div>
    </button>
  );
}
