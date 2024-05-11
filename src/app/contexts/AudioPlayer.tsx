"use client";
import { GlobalContext } from "@/app/contexts/global";
import { PostFeedsInterface } from "@/server/controllers/posts";
import {
  FastForward,
  Pause,
  Play,
  Repeat,
  Rewind,
  Shuffle,
  User2,
  Volume2Icon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  src: string;
  objectID: string;
  audio?: HTMLAudioElement;
  title: string;
  description?: string;
  author: {
    avatar: string;
    username: string;
    name: string;
  };
};

const button =
  "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50";

export default function AudioPLayerProps(props: AudioPlayerProps) {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [playing, togglePlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trackerIntervalRef = useRef<any>();

  useEffect(() => {
    togglePlay();
    return () => {
      clearInterval(trackerIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setVolume = (volume: number) => {
    if (props.audio) props.audio.volume = volume;
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

  function updateTimestamps(_audio: HTMLAudioElement, _width?: number) {
    if (_audio?.duration) {
      const width = _width || (_audio.currentTime / _audio.duration) * 100;
      containerRef.current &&
        containerRef.current.style.setProperty("--trackerWidth", `${width}%`);
      const timeElement =
        containerRef.current?.querySelector("[data-audio-time]");
      const durationElement = containerRef.current?.querySelector(
        "[data-audio-duration]"
      );
      if (timeElement)
        timeElement.innerHTML = formatAudioDuration(_audio.currentTime);
      if (durationElement)
        durationElement.innerHTML = formatAudioDuration(_audio.duration);
    }
  }

  function setupAudio(_audio: HTMLAudioElement, src: string) {
    clearInterval(trackerIntervalRef.current);
    _audio.muted = true;
    _audio.onplay = () => {
      togglePlaying(true);
      trackerIntervalRef.current = setInterval(() => {
        updateTimestamps(_audio);
      }, 1000);
      props.audio?.play();
    };

    _audio.onpause = () => {
      clearInterval(trackerIntervalRef.current);
      togglePlaying(false);
      props.audio?.pause();
    };

    _audio.onended = () => {
      clearInterval(trackerIntervalRef.current);
      togglePlaying(false);
      updateTimestamps(_audio, 100);
    };

    _audio.volume = getVolume();
    _audio.src = src;
    _audio.play();
  }

  const start = () => {
    clearInterval(trackerIntervalRef.current);
    if (!props.audio?.src) return;

    const _audio = audio || new Audio();
    _audio.currentTime = audio ? audio.currentTime : props.audio.currentTime;
    setupAudio(_audio, props.audio.src);
    setAudio(_audio);
  };

  const togglePlay = () => {
    clearInterval(trackerIntervalRef.current);
    if (!audio) return start();

    if (playing) {
      audio?.pause();
      togglePlaying(false);
      return;
    }
    audio?.play();
    togglePlaying(true);
  };

  const seekVideo = (type: 0 | 1) => {
    if (!audio) return;

    const percentage = 4;
    const totalDuration = audio.duration;

    function rewind(audio: any, percentage: number) {
      if (!audio) return;

      const targetTime = audio.currentTime - totalDuration * (percentage / 100);
      audio.currentTime = Math.max(0, targetTime); // Ensure current time is not negative
      updateTimestamps(audio);
    }

    function fastForward(audio: any, percentage: number) {
      if (!audio) return;
      const targetTime = audio.currentTime + totalDuration * (percentage / 100);
      audio.currentTime = Math.min(totalDuration, targetTime); // Ensure current time does not exceed total duration
      updateTimestamps(audio);
    }
    switch (type) {
      case 0:
        rewind(audio, percentage);
        rewind(props.audio, percentage);
        break;
      case 1:
        fastForward(audio, percentage);
        fastForward(props.audio, percentage);
        break;

      default:
        break;
    }
  };
  return (
    <div
      ref={containerRef}
      className="overflow-hidden w-full block"
      // @ts-ignore
      style={{ "--trackerWidth": "0%" }}
    >
      <div className="w-full flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-max">
            <div className="w-8 h-8 border border-gray-400 rounded-full overflow-hidden">
              {props.author?.avatar && (
                <Image
                  width={32} // Set width and height to maintain aspect ratio
                  height={32}
                  src={props.author.avatar}
                  alt="avatar"
                  className="w-full h-full rounded-full post-author-img"
                />
              )}
              {!props.author?.avatar && (
                <div className="h-full w-full dark:bg-black/30 flex items-center justify-center">
                  <User2 width={28} height={28} />
                </div>
              )}
            </div>
          </div>
          <div className="min-w-full flex-1 block">
            <h4 className="font-semibold text-sm">{props.title || ""}</h4>

            <p className="text-gray-500 text-xs dark:text-gray-400">
              @{props.author?.username}
            </p>
          </div>
        </div>
        <div className="flex items-center w-max gap-4">
          <VolumeController callback={setVolume} defaultValue={audio?.volume} />
        </div>
      </div>
      <div className="px-2 order-1">
        <div className="flex justify-between text-gray-500 dark:text-gray-400 text-xs gap-6">
          <div className="flex-1 mt-4 flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={() => seekVideo(0)}
                className={button}
                disabled={!playing}
              >
                <Rewind width={18} height={18} />
              </button>

              <button
                onClick={togglePlay}
                type="button"
                className={`
               ${
                 playing ? "text-primary" : "text-white/80"
               } hover:text-primaryHover transition-all
              `}
              >
                {playing ? (
                  <Pause width={18} height={18} />
                ) : (
                  <Play width={18} height={18} />
                )}
              </button>
              <button
                onClick={() => seekVideo(1)}
                className={button}
                disabled={!playing}
              >
                <FastForward width={18} height={18} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => seekVideo(1)}
                className={button}
                disabled={!playing}
              >
                <Repeat width={18} height={18} />
              </button>

              <button
                onClick={() => seekVideo(0)}
                className={button}
                disabled={!playing}
              >
                <Shuffle width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex mt-4 justify-between p-1 text-xs opacity-80">
          <span data-audio-time>-:--</span>
          <span data-audio-duration>-:--</span>
        </div>
        <div
          dir="ltr"
          data-orientation="horizontal"
          aria-disabled="false"
          className="relative flex w-full bg-gray-500/50 rounded-full touch-none select-none items-center"
        >
          <div
            data-orientation="horizontal"
            className="relative h-1 w-full grow overflow-hidden rounded-full bg-secondary"
          >
            <span
              data-orientation="horizontal"
              className="absolute h-full bg-primary rounded-full transition-[width]"
              style={{ left: "0%", width: "var(--trackerWidth)" }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VolumeController({ disabled, callback, defaultValue }: any) {
  return (
    <button
      type="button"
      className={`group relative disabled:bg-transparent disabled:!pointer-events-none disabled:opacity-10 ${button} transition-colors`}
      onClick={() => {}}
      title="Volume"
      disabled={disabled}
    >
      <Volume2Icon width={18} height={18} className="text-red" />
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
