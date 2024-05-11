type ImageSize = {
  width: number;
  height: number;
};

const maxSize: ImageSize = {
  width: 940,
  height: 580,
};

/** Resize the image and maintain the aspect-ration */
export function resizeImage(file: File, callback: (file: File | null) => void) {
  const reader = new FileReader();

  const maxSize = {
    width: 940,
    height: 580,
  };

  reader.onload = function (event) {
    const img = new Image();

    img.onload = function () {
      let width = img.width;
      let height = img.height;

      // Check if image size exceeds max size
      if (width > maxSize.width || height > maxSize.height) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate aspect ratio
        const aspectRatio = width / height;

        if (width > maxSize.width) {
          width = maxSize.width;
          height = width / aspectRatio;
        }

        if (height > maxSize.height) {
          height = maxSize.height;
          width = height * aspectRatio;
        }

        // Resize image
        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          // Draw the image in to a canvas
          ctx.drawImage(img, 0, 0, width, height);
          // Convert canvas to Blob
          canvas.toBlob(function (blob) {
            if (blob) {
              const _file = new File([blob], file.name, { type: file.type });
              return callback(_file);
            }
            return callback(null);
          }, file.type);
        }
      } else {
        // Image does not need resizing, pass original image
        callback(file);
      }
    };

    const results = event.target?.result;

    if (typeof results === "string") {
      img.src = results;
      return;
    }

    callback(null);
  };

  reader.readAsDataURL(file);
}
