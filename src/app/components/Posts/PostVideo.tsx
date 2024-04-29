"use client";
import { PostFeedsInterface } from "@/server/controllers/posts";
import { Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  post: PostFeedsInterface;
};

export default function PostVideo({ post }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaSource = useRef<MediaSource>();
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const source = new MediaSource();
    const buffer = () => {
      const sourceBuffer = mediaSource.current?.addSourceBuffer(
        'video/mp4; codecs="avc1.64001e"'
      );
      fetch(post.fileUrl, {
        headers: { "Content-Type": "video/mp4" },
      })
        .then((response) => response.arrayBuffer())
        .then((data) => {
          if (!sourceBuffer) return;
          sourceBuffer.appendBuffer(data);
        });
    };
    // source.addEventListener("sourceopen", buffer);
    mediaSource.current = source;
    return () => {
      source.removeEventListener("sourceopen", buffer);
    };
  }, [post.fileUrl]);

  function navigate() {
    // const url = `/videos/${slugify(video.id, {
    //   lower: true,
    //   strict: true,
    // })}`;
    // console.log(url);
    // router.push(url);
  }

  const preloadVideo = () => {
    if (play) return;
    if (videoRef.current && mediaSource.current) {
      setPlay(true);
      // videoRef.current.src = URL.createObjectURL(mediaSource.current);
      videoRef.current.preload = "metadata";
      videoRef.current.src = post.fileUrl;
      videoRef.current.play();
      const muted = Boolean(localStorage.getItem("_MediaMuted") === "true");
      const volume = Number(localStorage.getItem("_MediaVolume") || "0.5");

      if (!muted) videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  };

  return (
    <div className="block mx-auto relative" onClick={preloadVideo}>
      {!play && post.thumbnailUrl && (
        <div className="group absolute top-0 left-0 transition w-full h-full cursor-pointer z-[1] hover:bg-black/20">
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-6 bg-black/30 rounded-2xl group-btn">
              <Play
                className="group-hover:pointer-events-auto group-hover:scale-150 transition pointer-events-none text-white"
                width={38}
              />
            </div>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        width={600}
        controls={play}
        preload="thumbnail"
        onVolumeChange={({ target }) => {
          const video = target as HTMLVideoElement;
          localStorage.setItem("_MediaVolume", String(video.volume.toFixed(2)));
        }}
        className="md:min-[300px] max-h-[90svh] md:max-h-auto rounded-b-none"
        poster={post.thumbnailUrl!}
        disableRemotePlayback={true}
        disablePictureInPicture={true}
      >
        Your browser does not support the video tag <br /> Please update browser
        or use another browser.
      </video>
    </div>
  );
}
