const DEFAULT_OPTIONS = {
  maxDimension: 1280,
  quality: 0.7,
};

const getOptimizedFileName = (fileName) => {
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  return `${baseName || 'imagem'}.webp`;
};

export const optimizeImageFile = (file, options = DEFAULT_OPTIONS) => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  if (!file || !file.type?.startsWith('image/')) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      try {
        const ratio = Math.min(
          1,
          config.maxDimension / image.width,
          config.maxDimension / image.height
        );
        const width = Math.max(1, Math.round(image.width * ratio));
        const height = Math.max(1, Math.round(image.height * ratio));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            if (!blob || blob.size === 0) {
              resolve(file);
              return;
            }

            resolve(new File([blob], getOptimizedFileName(file.name), {
              type: 'image/webp',
              lastModified: Date.now(),
            }));
          },
          'image/webp',
          config.quality
        );
      } catch {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    image.src = objectUrl;
  });
};

export const fileToBase64 = (file) => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  })
);
