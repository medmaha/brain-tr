import { getStorage, ref } from "firebase/storage";
import {
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import firebaseApp from "./index";

const storage = getStorage(firebaseApp);

export async function uploadFile(imageFile: File | Blob, path: FileType) {
  return new Promise<string | undefined>((resolve) => {
    // calculate the upload time in secs
    console.time("upload");
    try {
      const storageRef = ref(storage, path + "s/" + Date.now().toString());
      const uploadTask = uploadBytes(storageRef, imageFile);
      uploadTask
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.timeLog("upload", path);
            resolve(downloadURL);
          });
        })
        .catch((error) => {
          console.error("Error uploading file:");
          console.timeLog("upload", path);
          resolve(undefined);
        })
        .finally(() => {
          console.timeEnd("upload");
        });
    } catch (err) {
      console.error("Error uploading file:", err);
      resolve(undefined);
    }
  });
}

export async function uploadFileStream(
  imageFile: File,
  path: FileType,
  cb: (value: number, cancel: any) => void
) {
  return new Promise<string | undefined>(async (resolve) => {
    try {
      const storageRef = ref(
        storage,
        "/" + path + "s/" + Date.now().toString()
      );
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on("state_changed", (snapshot) => {
        if (snapshot.state === "running") {
          cb(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            uploadTask.cancel()
          );
          uploadTask.cancel();
        }
      });
      const snapshot = await uploadTask;
      resolve(await getDownloadURL(snapshot.ref));
    } catch (err) {
      console.error("Error uploading file:", err);
      resolve(undefined);
    }
  });
}

export async function deleteUploadedFile(path: string, retries = 3) {
  const storageRef = ref(storage, path);
  try {
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    if (retries > 0) {
      return await deleteUploadedFile(path, retries - 1);
    }
    return false;
  }
}
