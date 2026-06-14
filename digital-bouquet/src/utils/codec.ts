import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

export const encodePayload = (obj: unknown) => {
  return compressToEncodedURIComponent(JSON.stringify(obj));
};

export const decodePayload = <T,>(str: string): T | null => {
  try {
    const raw = decompressFromEncodedURIComponent(str);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};
