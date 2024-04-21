export function isValidFileType(file: File, expectedType: FileType) {
  return true;
}

export async function compressFile(file: File) {
  return new Promise<File | Blob | undefined>((resolve, reject) => {
    return resolve(file);
  });
}
