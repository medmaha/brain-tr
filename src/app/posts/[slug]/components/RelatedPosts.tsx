"use client";
import { Fullscreen, Loader2, Pause, Play, Volume2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function RelatedPosts() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTrackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
      return;
    }
    const video = videoRef.current;
    video.pause();
  };

  // Play The video player
  const play = (event: any, time = 0) => {
    if (!videoRef.current) {
      return;
    }

    if (playing) return pause();

    const video = videoRef.current;

    if (video.paused) {
      togglePlaying(true);
      video.play();
      return;
    }

    video.onloadeddata = () => {
      toggleLoading(false);
    };

    let trackInterval: any; // An interval to track the progress of the video

    // An onplay event handler to track the progress of the video
    video.onplay = () => {
      togglePlaying(true);
      toggleLoading(false);
      const track = videoTrackRef.current;
      trackInterval = setInterval(() => {
        if (!track) {
          clearInterval(trackInterval);
          togglePlaying(false);
          return;
        }
        track.style.width = `${(video.currentTime / video.duration) * 100}%`;
      }, 1000);
    };

    const resetPlayer = () => {
      togglePlaying(false);
      clearInterval(trackInterval);
    };

    video.onpause = resetPlayer;
    video.onreset = resetPlayer;
    video.onended = () => {
      resetPlayer();
      videoTrackRef.current!.style.width = `100%`;
    };

    video.src = "https://www.w3schools.com/html/mov_bbb.mp4";
    video.currentTime = time;
    video.volume = getVolume();
    video.play();
  };

  const toggleFullScreen = async () => {
    if (!containerRef.current) {
      return;
    }
    const container = containerRef.current!;
    if (!document.fullscreenElement) {
      togglePlaying(true);
      await container.requestFullscreen();
      togglePlaying(false);
    } else {
      togglePlaying(true);
      await document.exitFullscreen();
      togglePlaying(false);
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

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[800px] mx-auto mt-16 bg-gray-900 rounded-lg overflow-hidden"
    >
      <div className="relative aspect-video group/container">
        <div className="absolute top-0 left-0 w-full h-full group-hover/container:flex bg-black/20 hidden transition duration-500 justify-center items-center">
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
        </div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2
              className="stroke-[3px] animate-spin text-primary"
              width={50}
              height={50}
            />
          </div>
        )}
        <div className="w-full h-full object-cover rounded-md">
          <video
            ref={videoRef}
            playsInline
            className="w-full h-full object-cover"
            poster="https://unsplash.it/800"
          ></video>
        </div>
        {controls && (
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
                        defaultValue="0.5"
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
                    const position = getMousePosition(event).toString() + "%";

                    event.currentTarget.style.setProperty(
                      "--pointer",
                      position
                    );
                  }}
                  onMouseDown={(event) => {
                    const position = getMousePosition(event);
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

const getMousePosition = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const offsetWidth = rect.width;
  const mouse = event.nativeEvent as MouseEvent;
  const position = Number(
    (((mouse.clientX - rect.left) / offsetWidth) * 100).toFixed(2)
  );
  return position;
};
