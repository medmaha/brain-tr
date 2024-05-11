import { uploadFileStream } from "@/lib/firebase/uploader";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Check, Loader2 } from "lucide-react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";

type Props = {
  video: File;
  ffmpeg: FFmpeg;
  updateData: (key: string, value: string | number) => void;
  setVideo: React.Dispatch<React.SetStateAction<File | undefined>>;
};

let cancelUpload: any = undefined;

export default function VideoUploader(props: Props) {
  const selectedFile = useRef<File>(props.video);
  const uploading = useRef(false);
  const compressing = useRef(false);
  const downloadUrl = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    return () => {
      try {
        cancelUpload();
        props.ffmpeg?.terminate();
      } catch (error) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compressVideo = useCallback(
    async (_file?: File) => {
      if (compressing.current) return;
      compressing.current = true;
      const video = _file || props.video;
      const ffmpeg = props.ffmpeg;

      if (!ffmpeg.loaded) {
        alert("Failed to load ffmpeg!");
        return;
      }

      await ffmpeg.writeFile("input.webm", await fetchFile(video));

      const commands = [
        "-i",
        "input.webm",
        "-r",
        "25",
        "-vf",
        "scale=940:-2",
        "-crf",
        "30",
        "-c:a",
        "aac",
        // "-b:a",
        // "128k",
        "output.mp4",
      ];

      try {
        await ffmpeg.exec(commands);
        const data = await ffmpeg.readFile("output.mp4");
        await Promise.all([
          ffmpeg.deleteFile("input.webm"),
          ffmpeg.deleteFile("output.mp4"),
        ]);
        const blob = new Blob([data], { type: video?.type });
        compressing.current = false;
        return blob;
      } catch (error) {
        ffmpeg.terminate();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const uploadVideo = useCallback(async (file?: any) => {
    if (uploading.current || compressing.current) return;

    const compressedVideo = (await compressVideo(file)) as File;
    if (!compressedVideo) return;

    uploading.current = true;

    const onUploadProgress = (progress: number, cancel: any) => {
      cancelUpload = cancel;
      if (progress > 99) uploading.current = false;

      dispatch({
        type: "progress",
        payload: {
          progress: {
            show: true,
            success: true,
            title: "Uploading",
            percentage: progress,
          },
        },
      });
    };

    // console.time("Uploading...");
    const url = await uploadFileStream(
      compressedVideo,
      "video",
      onUploadProgress
    );
    // console.timeEnd("Uploading...");

    if (downloadUrl.current && url) {
      downloadUrl.current.value = url!;
      props.updateData("file_url", url);
      dispatch({
        type: "progress",
        payload: {
          progress: {
            show: false,
            title: "",
            percentage: 0,
            message: (
              <>
                <Check className="text-green-500 w-4 h-4" />
                <span>Video uploaded!</span>
              </>
            ),
          },
        },
      });
    }

    return downloadUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const callback = ({ progress }: any) => {
      if (uploading.current) return;
      if (!compressing.current && !uploading.current) progress = 0;

      let p = Number((progress * 100).toFixed(0));
      if (p > 100 && compressing.current) {
        // compressing.current = false;
        p = 100;
      }

      if (String(p).length > 2) Number(String(p).substring(0, 2));

      dispatch({
        type: "progress",
        payload: {
          progress: {
            show: true,
            title: "Compressing",
            percentage: p,
          },
        },
      });
    };

    if (props.ffmpeg?.loaded && props.video?.name) {
      props.ffmpeg.on("progress", callback);
      uploadVideo();
    }

    const _file = selectedFile.current;
    return () => {
      props.ffmpeg.off("progress", callback);
      if (_file?.name != props.video.name) {
        compressing.current = false;
        uploading.current = false;
      }
    };
    // call once no matter what
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.video]);

  const selectFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.multiple = false;
    input.onchange = async () => {
      const file = input.files?.[0];
      input.remove();
      if (file) {
        dispatch({
          type: "progress",
          payload: {
            progress: {
              show: false,
              title: "",
              percentage: 0,
              message: <small>Processing...</small>,
            },
          },
        });
        selectedFile.current = file;
        compressing.current = false;
        uploading.current = false;

        try {
          cancelUpload();
        } catch (error) {}
        props.setVideo(file);
        await uploadVideo(file);
      }
    };

    input.click();
  };

  return (
    <div className="bg-black/30 h-full rounded-b-3xl shadow md:max-h-[60svh] pb-5">
      <input type="hidden" name="file_url" ref={downloadUrl} />
      <div className="grid gap-2">
        <video
          key={props.video?.name}
          ref={videoRef}
          controls
          className="w-full md:col-span-3"
        >
          <source src={props.video && URL.createObjectURL(props.video)} />
        </video>
      </div>
      <div className="flex items-center justify-between mt-2 gap-4 pl-2 pr-1">
        <div className="flex-1">
          <button
            type="button"
            className="p-1 text-xs px-2 text-left rounded bg-sky-500 hover:bg-sky-500/90 hover:shadow transition"
            onClick={selectFile}
          >
            {!props.video ? "Select file" : "Change File"}
          </button>
        </div>
        <div className="flex items-center relative pb-1 overflow-hidden">
          {state.progress.show && (
            <p className="text-xs inline-flex items-center">
              {state.progress.title}:{" "}
              <span className="min-w-[4ch] text-right">
                {state.progress.percentage.toFixed(0)}%
              </span>
            </p>
          )}
          {!state.progress.show && state.progress.message && (
            <p className="text-xs inline-flex items-center gap-2">
              {state.progress.message}
            </p>
          )}
          {props.video && !state.progress.show && !state.progress.message && (
            <p className="pt-1 pr-4 md:pt-2">
              <Loader2 className="animate-spin w-6 h-6" />
            </p>
          )}
          {state.progress.show && (
            <div className="overflow-hidden">
              <div className="absolute w-10 h-0.5 inline-block bottom-0 left-0 uploading bg-sky-500 rounded-md"></div>
            </div>
          )}
        </div>
      </div>
      {props.video && (
        <div className="mt-2 flex items-center gap-2 opacity-70 p-2">
          <p className="text-xs">Filename:</p>
          <input
            className="input text-xs focus:border border-none p-1"
            defaultValue={props.video.name}
            name="media_name"
          />
        </div>
      )}
    </div>
  );
}

const initState = {
  progress: {
    title: "",
    percentage: 0,
    show: false,
  },
} as State;

type State = {
  progress: {
    title: string;
    percentage: number;
    show: boolean;
    message?: ReactNode;
    success?: boolean;
  };
};
type Action = {
  payload?: Partial<State>;
  type: "progress" | "reset";
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return initState;
    case "progress":
      return {
        ...state,
        ...(action.payload || {}),
      };
    default:
      return state;
  }
}
