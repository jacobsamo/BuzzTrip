type MimeType = "image/jpeg" | "image/png" | "image/webp";

export const convertFileToArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (error) => reject(error);
  });

export const convertFileToBase64Url = async (file: File): Promise<string> => {
  // First get the array buffer
  const buffer = await file.arrayBuffer();
  // Convert to base64
  const bytes = new Uint8Array(buffer);
  const base64 = btoa(String.fromCharCode(...bytes));
  // Convert to base64url by replacing characters that are different in the URL-safe variant
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Keep for backward compatibility
export const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const convertBase64ToFile = (
  base64: string,
  fileName: string,
  mimeType: MimeType = "image/jpeg"
): Promise<File> =>
  new Promise(async (resolve, reject) => {
    const blob = await fetch(base64)
      .then((res) => res.blob())
      .catch((err) => {
        console.error(err);
        reject(err);
        return null;
      });
    if (!blob) return;

    const file = new File([blob], fileName, {
      type: mimeType,
    });
    resolve(file);
  });
