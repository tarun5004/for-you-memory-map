'use client';

import { useState } from 'react';

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(`Missing Cloudinary config. cloudName=${cloudName}, uploadPreset=${uploadPreset}`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    console.error('Cloudinary upload failed', {
      status: response.status,
      statusText: response.statusText,
      errorBody,
    });
    throw new Error(`Cloudinary upload failed (${response.status}): ${JSON.stringify(errorBody)}`);
  }

  const data = (await response.json()) as { secure_url?: string };
  if (!data.secure_url) {
    console.error('Cloudinary upload response missing secure_url', data);
    throw new Error(`Cloudinary upload did not return secure_url: ${JSON.stringify(data)}`);
  }

  return data.secure_url;
}

export const useCloudinary = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      return await uploadToCloudinary(file);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'Upload failed.';
      setError(message);
      throw uploadError;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};
