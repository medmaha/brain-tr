"use client";
import { Fullscreen, Loader2, Pause, Play, Volume2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type VideoPlayerProps = {
  src: string;
  poster: string;
  autoPlay?: boolean;
};

export default function VideoPlayer(props: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTrackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, toggleError] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [playing, togglePlaying] = useState(false);
  const [controls, toggleControls] = useState(false);

  useEffect(() => {
    toggleControls(true);
  }, []);

  const getVolume = () => {
    return Number(localStorage.getItem("_MediaVolume")) || 0.5;
  };

  // Pause The video player
  const pause = () => {
    if (!videoRef.current) {
      togglePlaying(false);
      return;
    }
    const video = videoRef.current;
    video.pause();
  };

  // Play The video player
  const play = async (_: any, time = 0) => {
    if (!videoRef.current) {
      return;
    }

    if (playing) return pause();

    const video = videoRef.current;

    if (video.src) return;

    if (video.paused && video.src) return video.play();
    console.log("play", time);

    video.src = props.src;
    video.currentTime = time;
    await video.play();
  };

  const toggleFullScreen = async () => {
    if (!containerRef.current) {
      return;
    }
    const container = containerRef.current!;
    if (!document.fullscreenElement) {
      toggleLoading(true);
      await container.requestFullscreen();
      toggleLoading(false);
    } else {
      toggleLoading(true);
      await document.exitFullscreen();
      toggleLoading(false);
    }
  };

  const playAtPosition = (percentage: number) => {
    if (!videoRef.current) {
      return;
    }
    const video = videoRef.current;
    const currentTime = Number(
      ((video.duration * percentage) / 100).toFixed(0)
    );

    if (video.src) {
      video.currentTime = currentTime;
      videoTrackRef.current!.style.width = `${percentage}%`;
    } else {
      play(undefined, currentTime);
    }
  };

  const changeVolume = (volume: number) => {
    if (!videoRef.current) {
      return;
    }
    const video = videoRef.current;
    video.volume = volume;
    localStorage.setItem("_MediaVolume", String(volume));
  };

  const getMousePositionPercentage = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetWidth = rect.width;
    const mouse = event.nativeEvent as MouseEvent;
    const position = Number(
      (((mouse.clientX - rect.left) / offsetWidth) * 100).toFixed(2)
    );
    return position;
  };

  const trackInterval = useRef<any>();

  function onLoadedData() {
    toggleLoading(false);
  }

  function onPause() {
    onReset();
  }

  function onPlay() {
    togglePlaying(true);
    clearInterval(trackInterval.current);

    const track = videoTrackRef.current;
    const video = videoRef.current!;

    video.volume = getVolume();
    trackInterval.current = setInterval(() => {
      if (!track) {
        togglePlaying(false);
        return;
      }
      track.style.width = `${(video.currentTime / video.duration) * 100}%`;
    }, 1000);
  }

  function onLoadStart() {
    const video = videoRef.current!;
    video.volume = getVolume();
    toggleLoading(true);
  }

  function onEnded() {
    onReset();
    videoTrackRef.current!.style.width = `100%`;
  }

  function onError() {
    alert("Video Error: " + videoRef.current!.error);
  }

  function onReset() {
    togglePlaying(false);
    toggleLoading(false);
    toggleError(false);
    clearInterval(trackInterval.current);
  }

  return (
    <div
      ref={containerRef}
      className="w-full mx-auto max-w-[800px] bg-transparent"
    >
      <div className="relative aspect-video group/container">
        <div className="absolute top-0 left-0 w-full h-full group-hover/container:flex bg-black/20 hidden transition duration-500 justify-center items-center">
          {!error && videoRef.current ? (
            <div
              onClick={play}
              className="hover:scale-125 p-2 group/btn z-10 transition-all"
            >
              {videoRef.current?.paused ? (
                <Play
                  width={48}
                  height={48}
                  className="group-hover/btn:scale-105 transition-all"
                />
              ) : (
                <Pause
                  width={48}
                  height={48}
                  className="group-hover/btn:scale-105 transition-all"
                />
              )}
            </div>
          ) : (
            <div className="font-semibold text-red-400">Error</div>
          )}
        </div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2
              className="stroke-[2px] animate-spin text-primary"
              width={70}
              height={70}
            />
          </div>
        )}
        <div className="w-full h-full object-cover rounded-md">
          <video
            playsInline
            ref={videoRef}
            controls={false}
            preload="thumbnail"
            onPlay={onPlay}
            onError={onError}
            onPause={onPause}
            onEnded={onEnded}
            poster={props.poster}
            autoPlay={props.autoPlay}
            onLoadStart={onLoadStart}
            onLoadedData={onLoadedData}
            className="w-full h-full object-cover rounded-b"
          />
        </div>
        {controls && !error && (
          <div className="absolute opacity-0 duration-500 group-hover/container:opacity-100 transition-all inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={(ev) => {
                    play(ev);
                    ev.preventDefault();
                    ev.stopPropagation();
                  }}
                  className="text-white hover:bg-gray-800/50 rounded-full p-2 transition-colors"
                >
                  {!playing ? (
                    <Play width={20} height={20} />
                  ) : (
                    <Pause width={20} height={20} />
                  )}
                  <span className="sr-only">{!playing ? "Play" : "Pause"}</span>
                </button>
                <button className="text-white relative group/volume hover:bg-gray-800/50 rounded-full p-2 transition-colors">
                  <Volume2 width={20} height={20} />
                  <span className="sr-only">Volume</span>
                  <dialog
                    id="volume"
                    className="hidden left-0 p-0 h-max group-hover/volume:block group-focus/volume:block bg-transparent"
                  >
                    <div className="p-3 border inline-flex items-center justify-centers h-max card rounded-r-full">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        className="stroke-primary m-0 border-none h-[3px] bg-primary outline-1 p-0.5"
                        defaultValue={getVolume()}
                        onChange={(e) => {
                          changeVolume(Number(e.target.value));
                        }}
                      />
                    </div>
                  </dialog>
                </button>
                <button
                  onClick={toggleFullScreen}
                  className="text-white hover:bg-gray-800/50 rounded-full p-2 transition-colors"
                >
                  <Fullscreen />
                  <span className="sr-only">Fullscreen</span>
                </button>
              </div>
              <div className="flex-1 z-10">
                <div
                  className="bg-gray-400/50 relative group rounded-full"
                  onMouseMove={(event) => {
                    const pointer: HTMLDivElement =
                      event.currentTarget.querySelector("#pointer")!;

                    if (!pointer) return;
                    const position =
                      getMousePositionPercentage(event).toString() + "%";

                    event.currentTarget.style.setProperty(
                      "--pointer",
                      position
                    );
                  }}
                  onMouseDown={(event) => {
                    const position = getMousePositionPercentage(event);
                    playAtPosition(position);
                  }}
                >
                  <div
                    style={{ width: 0 }}
                    className="h-1.5 rounded-full bg-primaryHover"
                    ref={videoTrackRef}
                  ></div>

                  <div
                    id="pointer"
                    className="absolute group-hover:opacity-100 transition opacity-0 w-4 h-4 -translate-y-1/2 top-1/2 rounded-full bg-primaryHover left-[--pointer]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
