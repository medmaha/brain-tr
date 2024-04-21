"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import Image from "next/image";
import { Loader2, RefreshCw, Trash2, Upload } from "lucide-react";

type Props = {
  video?: File;
  ffmpeg: FFmpeg;
  setReady: (value: boolean) => void;
  setThumbnail: (file: Blob) => void;
};

type Thumbnail = {
  id: string;
  file: Blob;
  deletable?: boolean;
  active: boolean;
  dummy?: boolean;
};

type CacheType = Map<"data", Thumbnail[]>;

export default function VideoThumbnail(props: Props) {
  const processing = useRef(false);
  const downloadUrl = useRef<string>();
  const selectedFile = useRef<File | undefined>(props.video);
  const cachedThumbnails = useRef<CacheType>();
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>(
    cachedThumbnails.current?.get("data") || []
  );

  useEffect(() => {
    const _file = selectedFile.current;
    const progress = ({ progress }: any) => {
      if (progress > 99 && processing.current) processing.current = false;
      else processing.current = true;
    };
    props.ffmpeg.on("progress", progress);
    return () => {
      props.ffmpeg.off("progress", progress);
      if (_file?.name !== props.video?.name) processing.current = false;
    };
  }, [props.video, props.ffmpeg]);

  const switchActiveFile = useCallback(
    (thumbnail: Thumbnail) => {
      props.setThumbnail(thumbnail.file);
      setThumbnails((prev) =>
        (prev || []).map((t) => {
          const data = {
            ...t,
            active: t.id === thumbnail.id,
          };

          if (data.active) {
            props.setReady(true);
          }
          return data;
        })
      );
    },
    [props]
  );

  const generateThumbnails = useCallback(
    async (file: File) => {
      if (processing.current) return;
      processing.current = true;

      const ffmpeg = props.ffmpeg;
      try {
        await ffmpeg.deleteFile("input.mp4");
      } catch (error) {}

      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      const isFileWritten = await ffmpeg.writeFile(
        "input.mp4",
        await fetchFile(file)
      );
      if (!isFileWritten) {
        // Handle error, maybe display message to user
        alert("Failed to write input file for ffmpeg");
        return;
      }

      const timestamps = ["00:00:00", "00:00:3", "00:00:5"];

      const promises = [] as Promise<any>[];
      const _thumbnails = [] as Thumbnail[];

      await ffmpeg.createDir("t");

      let idx = 0;
      const index = Math.floor(Math.random() * timestamps.length);
      async function get() {
        for (const timestamp of timestamps) {
          // Generate thumbnail for each timestamp
          await ffmpeg.exec([
            "-accurate_seek",
            "-i",
            "input.mp4",
            "-r",
            "1",
            "-ss",
            timestamp,
            "-t",
            "2",
            "-frames:v",
            "1",
            `-vf`,
            `thumbnail`,
            `t/output_${timestamp.replace(/:/g, "")}.jpg`,
          ]);
          const _tBuilder = async (_idx: number) => {
            const filename = `t/output_${timestamp.replace(/:/g, "")}.jpg`;
            const data = await ffmpeg.readFile(filename);
            const thumbnail: Thumbnail = {
              id: getUniqueId() + 1,
              file: new Blob([data], { type: "image/png" }),
              active: idx === 0 || _idx === index,
              dummy: false,
            };
            promises.push(ffmpeg.deleteFile(filename));
            return thumbnail;
            // return async () => {
            // };
          };
          const _i = Number(idx);
          const thumbnail = await _tBuilder(_i);
          _thumbnails.push(thumbnail);
          setThumbnails(() => [...getThumbnails(_thumbnails)]);
          if (idx === 0) {
            switchActiveFile(thumbnail);
          }
          idx++;
        }
      }
      await get();
      setThumbnails(getThumbnails([..._thumbnails]));
      promises.push(ffmpeg.deleteFile("t"));
      promises.push(ffmpeg.deleteDir("t"));
      processing.current = false;
      await Promise.all<typeof promises>(promises);
      const activeThumbnail = _thumbnails.find((t) => t.active);
      if (activeThumbnail) {
        switchActiveFile(activeThumbnail);
      }
      cachedThumbnails.current = cachedThumbnails.current || new Map();
      cachedThumbnails.current.set("data", _thumbnails);
      return;
    },
    [props.ffmpeg, switchActiveFile]
  );

  useEffect(() => {
    async function func() {
      if (processing.current) return;
      if (props.video) {
        await generateThumbnails(props.video);
      }
    }
    func();
  }, [props.video, generateThumbnails]);

  const selectFile = () => {
    if (!thumbnails || thumbnails.length > 4) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;
    input.onchange = async () => {
      const file = input.files?.[0];
      input.remove();
      if (file) {
        const _t = {
          id: getUniqueId(),
          file: file,
          deletable: true,
          active: true,
        };
        setThumbnails((prev) => [
          ...(prev || []).map((t) => ({ ...t, active: false })),
          _t,
        ]);
        switchActiveFile(_t);
        props.setReady(true);
      }
    };
    input.click();
  };

  function removeThumbnail(thumbnail: Thumbnail) {
    setThumbnails((prev) =>
      (prev || []).filter((t) => t.file !== thumbnail.file)
    );
    if (thumbnails) switchActiveFile(thumbnails[0]);
  }

  const getThumbnails = (thumbnails: Thumbnail[]) => {
    if (!thumbnails.length) return [];

    const MIN_THUMBNAILS = 3;

    if (thumbnails.length >= MIN_THUMBNAILS) {
      return thumbnails;
    }

    const result: Thumbnail[] = [];

    for (let i = 0; i < thumbnails.length; i++) {
      result.push(thumbnails[i]);
    }

    const remainingSlots = MIN_THUMBNAILS - thumbnails.length;
    for (let i = 0; i < remainingSlots; i++) {
      result.push({
        file: thumbnails[0].file || new Blob([], { type: "image/png" }),
        dummy: true,
        active: false,
        id: getUniqueId() + i,
      });
    }
    return result;
  };

  return (
    <>
      {!thumbnails.length ? (
        <></>
      ) : (
        <>
          <div className="flex items-center sm:justify-end md:justify-start gap-4">
            <div className="">
              <button
                disabled={thumbnails && thumbnails.length > 4}
                onClick={selectFile}
                className="disabled:cursor-not-allowed disabled:opacity-55 h-[60px] gap-1 w-[100px] bg-sky-500 hover:bg-sky-500/90 rounded-md flex items-center justify-center flex-col text-xs"
              >
                <span className="tracking-wide"> Upload </span>
                <Upload width={20} height={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 items-center lg:grid-cols-4">
              {thumbnails.map((thumbnail) => {
                return (
                  <div key={thumbnail.id} className="relative group h-max">
                    <Image
                      onClick={() => switchActiveFile(thumbnail)}
                      alt="Thumbnail"
                      placeholder="blur"
                      blurDataURL={URL.createObjectURL(thumbnail.file)}
                      src={URL.createObjectURL(thumbnail.file)}
                      width={90}
                      height={60}
                      className={`rounded transition-all duration-300 ${
                        thumbnail.active
                          ? "ring-2 bg-transparent outline ring-sky-500 ring-offset-2"
                          : ""
                      } ${thumbnail.dummy ? "" : ""}`}
                    />
                    {thumbnail.deletable && (
                      <button
                        title="Remove thumbnail"
                        onClick={() => removeThumbnail(thumbnail)}
                        className="p-2 group-hover:z-10 rounded-xl hover:text-red-400 bg-transparent group-hover:bg-black/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition flex items-center justify-center"
                      >
                        <Trash2 className="w-2.5 h-2.5 text-current" />
                      </button>
                    )}

                    {thumbnail.dummy && (
                      <div className="bg-black/50 backdrop-blur-[3px] z-10 w-full h-full absolute top-0 left-0 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-current stroke-4 animate-spin" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function getUniqueId() {
  return Math.random().toString(7);
}
