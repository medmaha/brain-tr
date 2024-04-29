"use client";
import {
  Loader2,
  Mic,
  MicIcon,
  MicOffIcon,
  Pause,
  Play,
  Volume2Icon,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  recording: boolean;
  sendFile: (file: File) => Promise<boolean>;
  setRecording: (recording: boolean) => void;
};

// prettier-ignore
export default function AudioRecorder({recording, setRecording, ...props}: Props) {

  const [state, setState] = useState<MediaRecorder["state"]>();

  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [playing, setPlaying] = useState(false);

  const audioChunks = useRef<Blob[]>([]);
  const [recorder, setRecorder] = useState<MediaRecorder>();

  const recordingTimerRef = useRef<HTMLParagraphElement>(null);
  const recordingProgressRef = useRef<HTMLParagraphElement>(null);

  const getMicrophoneStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (error) {
      alert("Please allow Viby to access your microphone");
      return null;
    }
  };

  const clearMicrophoneStream = (stream: MediaStream) => {
    try {
      stream.getTracks().forEach((track) => track.stop());
      recorder?.stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      alert("Failed to clear media streams");
      return null;
    }
  };

  const audioRecorder = async () => {
    // if (recording) return
    const stream = await getMicrophoneStream();
    if (!stream) return; // Handle permission denial

    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    let timer = 0;
    let interval: undefined | ReturnType<typeof setInterval> = undefined;

    mediaRecorder.ondataavailable = (event) => {
      clearInterval(interval);
      setState(mediaRecorder.state);
      chunks.push(event.data);
      audioChunks.current = [...chunks]
      setState(mediaRecorder.state);
    };

    mediaRecorder.onpause = () => {
      clearInterval(interval);
      mediaRecorder.requestData();
      setState(mediaRecorder.state);
    };

    mediaRecorder.onresume = async () => {
      clearInterval(interval);
      setState(mediaRecorder.state);
      interval = setInterval(() => {
        timer += 1000; // Increment by 1 second

        timerUpdate(mediaRecorder, timer);
      }, 1000);
    };

    mediaRecorder.onstop = () => {
      clearInterval(interval);
      audio?.pause()
      audioChunks.current = [...chunks]
      clearMicrophoneStream(stream);
      setState(mediaRecorder.state);
    };

    mediaRecorder.onstart = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        timer += 1000; // Increment by 1 second
        timerUpdate(mediaRecorder, timer);
      }, 1000);
    };

    mediaRecorder.start();

    setState(mediaRecorder.state);
    return mediaRecorder;
  };

  function timerUpdate(mediaRecorder: MediaRecorder, timer = 0) {
    const minutes = Math.floor(timer / 60000);
    const seconds = String(Math.floor((timer % 60000) / 1000)).padStart(2, "0");

    const progress = (timer / 60000) * 100;

    if (recordingTimerRef.current) {
      if (minutes === 1) {
        mediaRecorder.stop();
        recordingProgressRef.current!.style.width = `0.01%`;
        recordingTimerRef.current.innerHTML = `1:00`;
        return;
      }
      recordingProgressRef.current!.style.width = `${progress}%`;
      recordingTimerRef.current.innerHTML = `<small>${minutes}:${seconds}</small>`;
    }
  }

  const record = async () => {
    const recorder = await audioRecorder();
    setRecorder(recorder);
    if (recorder) setRecording(true);
  };

  const playSound = () => {
    if (!audioChunks.current.length || sending) return;
    recordingProgressRef.current!.style.width = `0.01%`;

    const audio = new Audio();
    audio.volume = Number(localStorage.getItem("_MediaVolume") || 0.5);
    audio.src = URL.createObjectURL(new Blob(audioChunks.current, {type: audioChunks.current[0].type}));

    let timer = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    audio.onplay = () => {
      clearInterval(interval);
      setPlaying(true);
      interval = setInterval(() => {
        timer += 1000; // Increment by 1 second
        timerUpdate(recorder!, timer);
      }, 1000);
    };

    audio.onpause = () => {
      clearInterval(interval);
    };

    audio.onended = () => {
      clearInterval(interval);
      setPlaying(false);
      audio.src = "";
    };

    audio.play();
    setAudio(audio);
  };

  const pauseSound = () => {
    setPlaying(false);
    if (!audio) return;
    audio.pause();
    audio.src = "";
  };

  const [sending, setSending] = useState(false);

  const send = async ()=>{
    setSending(true);
    if (recorder) {
      recorder.stop()
    };
    if (audioChunks.current.length) {
      const file = new File(audioChunks.current, `comment-audio-${Date.now()}`, {
        type: audioChunks.current[0].type,
      })

      const succeed = await props.sendFile(file);

      if (succeed) { 
        setAudio(undefined)
        setRecorder(undefined)
        setRecording(false)
        setPlaying(false)
        audioChunks.current = []
      } 
    }else alert("Please record a message first")
    setSending(false)
  }
 
  return (
    <>
      <button
      disabled={sending}
        onClick={record}
        className={` inline-block p-0.5 border ${
          recording ? "border-red-400" : ""
        } border-opacity-80 rounded-full text-sm inline-flex items-center justify-center`}
        title="Voice Message"
      >
        <Mic
          className={`${recording ? "text-red-400" : ""}`}
          width={15}
          height={15}
        />
      </button>

      {recording && (
        <div className="absolute flex bg-black/10 items-center p-3 justify-center px-0 top-0 left-0 w-[calc(100%-36px)] h-full">
          <div className="flex items-center p-4 gap-6 bg-gray-700 top-0 left-0 w-[calc(100%-36px)] bg-red rounded-full">
            <div className="flex items-center gap-2">
              {state !== "recording" && (
                <>
                  {playing && (
                    <button
                      className="group relative"
                      onClick={() => {}}
                      title="Volume"
                      disabled={sending}

                    >
                      <Volume2Icon
                        className="text-red"
                        width={16}
                        height={16}
                      />
                      <dialog
                        itemID="volume"
                        className="hidden p-0 h-max group-hover:active:block group-focus:block bg-transparent"
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
                              localStorage.setItem(
                                "_MediaVolume",
                                e.target.value
                              );
                              if (audio) {
                                audio.volume = Number(e.target.value);
                              }
                            }}
                          />
                        </div>
                      </dialog>
                    </button>
                  )}
                  <button
                    className=""
                    disabled={sending}
                    onClick={() => {
                      if (playing && audio) pauseSound();
                      else playSound();
                    }}
                  >
                    {playing && (
                      <Pause className="text-red" width={16} height={16} />
                    )}
                    {!playing && (
                      <Play className="text-red" width={16} height={16} />
                    )}
                  </button>
                </>
              )}
              <button
                className=""
                disabled={sending}

                onClick={() => {
                  if (playing) return pauseSound();
                  if (state === "paused") recorder?.resume();
                  else if (state === "recording") recorder?.pause();
                }}
              >
                {state === "recording" && (
                  <MicOffIcon className="text-red-500" width={16} height={16} />
                )}
                {state === "paused" && (
                  <MicIcon className="text-blue-500" width={16} height={16} />
                )}
              </button>
              <div className="">
                <div className="flex items-center gap-1 transition-all">
                  <p className="text-xs" ref={recordingTimerRef}>
                    <small>0:00</small>
                  </p>
                  <p className="text-xs">
                    <small>/</small>
                  </p>
                  <p className="text-xs">
                    <small>1:00</small>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 card h-1.5 rounded-full overflow-hidden">
              <p
                ref={recordingProgressRef}
                className={`h-full w-0 transition-all ${
                  state === "recording" ? "bg-primaryHover" : "bg-white"
                }`}
              ></p>
            </div>
            <button  disabled={sending} onClick={send} className="text-xs text-primary inline-flex items-center gap-1 hover:text-primaryHover transition-all">
              Send {sending && <Loader2 className="animate-spin w-4 h-4"/>}
            </button>
            <button
              className=""
              onClick={() => {
                if (state === "recording") recorder?.stop();
                else {
                  recorder?.stop();
                  setRecording(false);
                }
              }}
            >
              <X className="text-red" width={16} height={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
