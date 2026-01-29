import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512',{
      device: 'webgpu',
    });
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('Segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask
    const outputImageData = outputCtx.getImageData(
      0, 0,
      outputCanvas.width,
      outputCanvas.height
    );
    const data = outputImageData.data;
    
    // Apply inverted mask to alpha channel
    for (let i = 0; i < result[0].mask.data.length; i++) {
      // Invert the mask value (1 - value) to keep the subject instead of the background
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Mask applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

// Quick solid background removal: sample border, flood-fill from edges, then remove neutral light grays
export const removeSolidBackground = async (
  imageElement: HTMLImageElement,
  options?: { sampleBorder?: number; threshold?: number }
): Promise<Blob> => {
  const sampleBorder = options?.sampleBorder ?? 6;
  const threshold = options?.threshold ?? 60;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.drawImage(imageElement, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const { width, height } = imgData;

  // 1) Estimate background color from border samples
  let r = 0, g = 0, b = 0, count = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < sampleBorder || y < sampleBorder || x >= width - sampleBorder || y >= height - sampleBorder) {
        const i = (y * width + x) * 4;
        r += data[i]; g += data[i + 1]; b += data[i + 2];
        count++;
      }
    }
  }
  if (count === 0) count = 1;
  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  const dist = (r1: number, g1: number, b1: number) => {
    const dr = r1 - r, dg = g1 - g, db = b1 - b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // 2) Flood fill from edges to remove connected background
  const visited = new Uint8Array(width * height);
  const stack: number[] = [];
  const pushIfSimilar = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (dist(data[i], data[i + 1], data[i + 2]) <= threshold) {
      visited[idx] = 1;
      stack.push(idx);
    }
  };
  for (let x = 0; x < width; x++) {
    pushIfSimilar(x, 0);
    pushIfSimilar(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfSimilar(0, y);
    pushIfSimilar(width - 1, y);
  }
  while (stack.length) {
    const idx = stack.pop()!;
    const i = idx * 4;
    data[i + 3] = 0; // make transparent
    const x = idx % width;
    const y = Math.floor(idx / width);
    pushIfSimilar(x + 1, y);
    pushIfSimilar(x - 1, y);
    pushIfSimilar(x, y + 1);
    pushIfSimilar(x, y - 1);
  }

  // 3) Remove light neutral grays (keeps dark text and colorful logo)
  const luminance = (rr: number, gg: number, bb: number) => 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] === 0) continue; // already transparent
      const rr = data[i], gg = data[i + 1], bb = data[i + 2];
      const neutrality = Math.max(Math.abs(rr - gg), Math.abs(rr - bb), Math.abs(gg - bb));
      const lum = luminance(rr, gg, bb);
      if (neutrality < 18 && lum > 180) {
        data[i + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob'));
    }, 'image/png', 1.0);
  });
};
