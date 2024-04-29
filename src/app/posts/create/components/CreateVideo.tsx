"use client";
import { useState, useEffect } from "react";
import VideoUploader from "./VideoUploader";
import VideoThumbnail from "./VideoThumnail";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { deleteUploadedFile } from "@/lib/firebase/uploader";
import { VideoDetails } from "./VideoDetails";
import { createPost, getVideoData } from "../actions";
import { useRouter } from "next/navigation";
import SubmitLine from "./SubmitLine";

const msg = "Are you sure you want to leave? all data will be lose.";

let COMPUTED = false;
let ALERTED = false;
function beforeUnload(event: any) {
  if (!COMPUTED) return;
  event.preventDefault();
  ALERTED = true;
  try {
    event.returnValue = ""; // chrome requires the empty string
    event.returnValue = msg; // Standard way
  } catch (error) {}
  return msg; // Safari requires this
}

const onCancel = function (event: any) {
  COMPUTED = data.size > 1;
};

const pageLeave = async function (event: any) {
  if (!COMPUTED) return;
  if (ALERTED) beforeUnload(event);
  try {
    const promises = [] as Promise<boolean>[];
    if (data.get("file_url")) {
      promises.push(deleteUploadedFile(data.get("file_url")));
    }
    if (data.get("thumbnail_url")) {
      promises.push(deleteUploadedFile(data.get("thumbnail_url")));
    }
    await Promise.all(promises);
    COMPUTED = false;
  } catch (error) {
    console.log(error);
  }
};

const data = new Map();

export default function CreateVideo() {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [thumbnail, setThumbnail] = useState<Blob>();
  const [ready, setReady] = useState(false);
  const [ffmpeg, setFFmpeg] = useState<FFmpeg>();

  useEffect(() => {
    init();
    return () => {
      ffmpeg?.terminate();
      window.removeEventListener("cancel", onCancel);
      window.removeEventListener("pagehide", pageLeave);
      window.removeEventListener("beforeunload", beforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // prevent the user from leaving or refreshing the page
    window.addEventListener("cancel", onCancel);
    window.addEventListener("pagehide", pageLeave);
    window.addEventListener("beforeunload", beforeUnload);
  }, []);

  async function init() {
    const ffmpeg = await loadFFmpeg();
    if (ffmpeg) {
      setFFmpeg(ffmpeg);
    }
  }

  function updateData(key: string, value: string | number) {
    data.set(key, value);
    COMPUTED = data.size > 1;
    setReady(true);
  }

  function selectFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.multiple = false;
    input.onchange = async () => {
      const file = input.files?.[0];
      input.remove();
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await getVideoData(formData);
        console.log(response);
        // setFile(file);
      }
    };
    input.click();
  }

  async function submitForm(formData: FormData) {
    if (!thumbnail)
      // TODO: force the user to select a thumbnail
      return alert("Please select a thumbnail for your video");

    if (!data.get("file_url"))
      // TODO: recompress the video and upload it
      return alert("Please select a video for your post");

    if (!formData.get("caption"))
      // TODO: force the user to add a caption
      return alert("Please add a caption for your post");
    let caption = formData.get("caption")?.toString()!;
    let file_url = formData.get("file_url")?.toString()!;
    let media_name = formData.get("media_name")?.toString()!;
    let hashtags = formData.get("hashtags")?.toString()!;

    while (formData.keys().next().value) {
      const key = formData.keys().next().value;
      formData.delete(formData.keys().next().value);
    }

    formData.append("caption", caption);
    formData.append("hashtags", hashtags);
    formData.append("media_name", media_name);
    formData.append("file_type", "video");
    formData.append("file_url", data.get("file_url"));
    formData.append("thumbnail", thumbnail);

    const response = await createPost(formData);

    if (response.success) {
      return router.replace(`/posts/${response.slug}`);
    }

    alert(response.message);

    COMPUTED = false;
    data.clear();
  }

  let isReady = file && ffmpeg && ready;

  return (
    <div className="max-w-[850px] block shadow-lx mx-auto card border dark:border-gray-500/20 rounded-md">
      <div className="p-2 border-b flex items-center justify-between">
        <button>
          <ArrowLeft
            onClick={() => router.back()}
            className="w-5 h-5"
            strokeWidth={2}
          />
        </button>
        <h2 className="md:text-lg sm:font-semibold">Post a Video</h2>
      </div>
      <form action={submitForm} className="group p-4">
        {!ffmpeg && (
          <div className="flex min-h-[70svh] md:min-h-[60svh] h-full w-full items-center justify-center">
            <div className="flex flex-col justify-center gap-1 items-center">
              <Loader2
                //   stroke="2"
                className="w-6 h-6 animate-spin text-sky-500"
              />
              <p className="text-sm opacity-90 text-center">
                Setting up your <b>system</b>
              </p>
              <p className="text-xs mt-6 leading-relaxed max-w-[40ch] mx-auto text-center opacity-70">
                If this is your first time creating a post with <b>video</b>{" "}
                <br />
                it will take a few seconds or minutes.
              </p>
            </div>
          </div>
        )}
        {!isReady && ffmpeg && (
          <div className="flex min-h-[70svh] md:min-h-[60svh] h-full w-full items-center justify-center">
            <div className="grid gap-4 items-center justify-center">
              <div className="flex flex-col gap-1 items-center justify-center">
                <p className="text-sm md:text-base">Upload a Video</p>
                {!file && <Upload className="w-6 h-6" />}
                {file && (
                  <Loader2
                    //   stroke="2"
                    className="w-6 h-6 animate-spin text-sky-500"
                  />
                )}
              </div>
              <button
                type="button"
                disabled={!!file}
                onClick={selectFile}
                className="disabled:opacity-20 disabled:pointer-events-none p-2 bg-sky-500 hover:bg-sky-500/90 rounded"
              >
                Select File
              </button>
            </div>
          </div>
        )}
        {file && (
          <div className={`grid space-y-4 gap-4 md:grid-cols-[1fr,300px]`}>
            <div className="md:order-last">
              {isReady && (
                <VideoUploader
                  video={file}
                  ffmpeg={ffmpeg!}
                  setVideo={setFile}
                  updateData={updateData}
                />
              )}
            </div>
            <div className="space-y-4">
              {isReady && (
                <>
                  <VideoDetails thumbnail={thumbnail} />
                </>
              )}
              <VideoThumbnail
                video={file}
                // ffmpeg={ffmpeg!}
                setReady={setReady}
                setThumbnail={setThumbnail}
              />
            </div>
          </div>
        )}

        {isReady && <SubmitLine data={data} />}
      </form>
    </div>
  );
}

export const loadFFmpeg = async () => {
  const ffmpeg = new FFmpeg();
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  if (ffmpeg.loaded) return ffmpeg;
  return null;
};
