import FFMpeg from "ffmpeg";
import { exec } from "child_process";

type InputFile = File | Buffer | Blob;

export function compressVideo(file: InputFile) {
  return new Promise((resolve, reject) => {
    const ffmpeg = new FFMpeg("", (err, video) => {
      if (err) reject(false);

      resolve(video);
    });
  });
}
