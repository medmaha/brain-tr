"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";

type Props = {
  video?: File;
  ffmpeg: FFmpeg;
  setReady: (value: boolean) => void;
  thumbnail: Blob | undefined;
  setThumbnail: (file: Blob) => void;
};

type Thumbnail = {
  id: string;
  file: Blob;
  deletable?: boolean;
  active: boolean;
  dummy?: boolean;
};

export default function VideoThumbnail(props: Props) {
  const processing = useRef(false);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.setReady, props.setThumbnail]
  );

  const generateThumbnails = useCallback(async () => {
    const file = props.video!;
    if (processing.current) return;
    processing.current = true;

    const _ffmpeg = props.ffmpeg;

    if (!_ffmpeg) {
      alert("Failed to load ffmpeg!");
      return;
    }

    const isFileWritten = await _ffmpeg.writeFile(
      "input.webm",
      await fetchFile(file)
    );
    if (!isFileWritten) {
      // Handle error, maybe display message to user
      alert("Failed to write input file for ffmpeg");
      return;
    }

    const timestamps = ["00:00:01", "00:00:03", "00:00:05"];

    const promises = [] as Promise<any>[];
    const _thumbnails = [] as Thumbnail[];

    await _ffmpeg.createDir("t");

    let idx = 0;
    const index = Math.floor(Math.random() * timestamps.length);
    async function get() {
      for (const timestamp of timestamps) {
        // Generate thumbnail for each timestamp
        await _ffmpeg?.exec([
          "-i",
          "input.webm",
          "-r",
          "1",
          "-ss",
          timestamp,
          "-t",
          "1",
          "-frames:v",
          "1",
          "-vf",
          "scale=960:-2",
          `t/output_${idx + 1}.jpg`,
        ]);
        const _tBuilder = async (_idx: number) => {
          const filename = `t/output_${idx + 1}.jpg`;
          const data = await _ffmpeg!.readFile(filename);
          const thumbnail: Thumbnail = {
            id: getUniqueId() + 1,
            file: new Blob([data], { type: "image/png" }),
            active: idx === 0 || _idx === index,
            dummy: false,
          };
          promises.push(_ffmpeg!.deleteFile(filename));
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
    promises.push(_ffmpeg.deleteDir("t"));
    await Promise.all<typeof promises>(promises);
    const activeThumbnail = _thumbnails.find((t) => t.active);
    if (activeThumbnail) {
      switchActiveFile(activeThumbnail);
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    //
    const progress = ({ progress }: any) => {
      if (progress > 99 && processing.current) processing.current = false;
      else processing.current = true;
    };

    if (props.video && props.ffmpeg?.loaded && !props.thumbnail) {
      props.ffmpeg.on("progress", progress);
      generateThumbnails();
    }

    return () => {
      props.ffmpeg?.off("progress", progress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.video]);

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
