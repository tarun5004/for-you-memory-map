'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { encodePayload } from '@/utils/codec';
import { extractYouTubeId } from '@/utils/media';
import { useCloudinary } from '@/hooks/useCloudinary';
import type { GiftPayload, GiftPhoto } from '@/types/gift';

type DraftPhoto = GiftPhoto & {
  id: string;
  uploading?: boolean;
  failed?: boolean;
  errorMessage?: string;
};

type StoredCreatorDraft = {
  receiverName: string;
  senderName: string;
  spotifyUrl: string;
  youtubeUrl: string;
  letter: string;
  pin: string;
  photos: GiftPhoto[];
  generatedUrl: string;
  savedAt: number;
};

const sampleLetter =
  'I made this little place so our memories could live somewhere soft.\n\nEvery photo here is a tiny proof that ordinary days can turn into something I keep returning to.\n\nThank you for being you.';

const CREATOR_DRAFT_KEY = 'for-you-creator-draft-v1';
const MAX_QR_CODE_TEXT_LENGTH = 1800;

const getSpotifyTrackId = (url: string) => url.match(/track\/([a-zA-Z0-9]+)/)?.[1] ?? '';

const getGiftBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');
  return configuredUrl || window.location.origin;
};

const createPhotoId = () => `saved-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const canPersistPhotoUrl = (url: string) => /^https?:\/\//i.test(url);

const normalizeStoredPhotos = (photos: StoredCreatorDraft['photos'] = []) =>
  photos
    .filter((photo) => photo && typeof photo.url === 'string' && canPersistPhotoUrl(photo.url))
    .slice(0, 6)
    .map((photo) => ({
      id: createPhotoId(),
      url: photo.url,
      caption: typeof photo.caption === 'string' ? photo.caption : '',
    }));

const readStoredDraft = (): StoredCreatorDraft | null => {
  try {
    const raw = window.localStorage.getItem(CREATOR_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Partial<StoredCreatorDraft>;
    return {
      receiverName: typeof draft.receiverName === 'string' ? draft.receiverName : '',
      senderName: typeof draft.senderName === 'string' ? draft.senderName : '',
      spotifyUrl: typeof draft.spotifyUrl === 'string' ? draft.spotifyUrl : '',
      youtubeUrl: typeof draft.youtubeUrl === 'string' ? draft.youtubeUrl : '',
      letter: typeof draft.letter === 'string' && draft.letter.trim() ? draft.letter : sampleLetter,
      pin: typeof draft.pin === 'string' ? draft.pin.replace(/\D/g, '').slice(0, 4) : '',
      photos: Array.isArray(draft.photos) ? draft.photos : [],
      generatedUrl: typeof draft.generatedUrl === 'string' ? draft.generatedUrl : '',
      savedAt: typeof draft.savedAt === 'number' ? draft.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
};

export default function CreatorForm() {
  const draftReadyRef = useRef(false);
  const restoredDraftRef = useRef(false);
  const [receiverName, setReceiverName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [letter, setLetter] = useState(sampleLetter);
  const [pin, setPin] = useState('');
  const [photos, setPhotos] = useState<DraftPhoto[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy');
  const [formError, setFormError] = useState('');
  const [draftStatus, setDraftStatus] = useState('');
  const { uploadImage, uploading, error } = useCloudinary();

  const trackId = useMemo(() => getSpotifyTrackId(spotifyUrl), [spotifyUrl]);
  const youtubeId = useMemo(() => extractYouTubeId(youtubeUrl), [youtubeUrl]);
  const uploadedPhotoCount = photos.filter((photo) => !photo.uploading && !photo.failed).length;

  const payload = useMemo<GiftPayload>(
    () => ({
      receiverName: receiverName.trim(),
      senderName: senderName.trim(),
      spotifyUrl: spotifyUrl.trim(),
      youtubeUrl: youtubeUrl.trim(),
      youtubeId: youtubeId || undefined,
      letter: letter.trim(),
      pin: pin.length === 4 ? pin : undefined,
      photos: photos
        .filter((photo) => photo.url && !photo.uploading && !photo.failed)
        .map(({ url, caption }) => ({ url, caption: caption.trim() })),
    }),
    [letter, photos, pin, receiverName, senderName, spotifyUrl, youtubeId, youtubeUrl],
  );

  useEffect(() => {
    const draft = readStoredDraft();
    if (!draft) {
      draftReadyRef.current = true;
      return;
    }

    setReceiverName(draft.receiverName);
    setSenderName(draft.senderName);
    setSpotifyUrl(draft.spotifyUrl);
    setYoutubeUrl(draft.youtubeUrl);
    setLetter(draft.letter);
    setPin(draft.pin);
    setPhotos(normalizeStoredPhotos(draft.photos));
    setGeneratedUrl(draft.generatedUrl);
    setDraftStatus('Last draft restored from this browser.');
    restoredDraftRef.current = true;
    draftReadyRef.current = true;
  }, []);

  useEffect(() => {
    if (!draftReadyRef.current) return;

    const draft: StoredCreatorDraft = {
      receiverName,
      senderName,
      spotifyUrl,
      youtubeUrl,
      letter,
      pin,
      generatedUrl,
      savedAt: Date.now(),
      photos: photos
        .filter((photo) => !photo.uploading && !photo.failed && canPersistPhotoUrl(photo.url))
        .map(({ url, caption }) => ({ url, caption })),
    };

    try {
      window.localStorage.setItem(CREATOR_DRAFT_KEY, JSON.stringify(draft));
      if (!draftStatus && !restoredDraftRef.current) setDraftStatus('Draft autosaved in this browser.');
    } catch {
      setDraftStatus('Draft autosave is unavailable in this browser.');
    }
  }, [draftStatus, generatedUrl, letter, photos, pin, receiverName, senderName, spotifyUrl, youtubeUrl]);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, Math.max(0, 6 - photos.length));
    event.target.value = '';
    if (!files.length) return;

    for (const file of files) {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const previewUrl = URL.createObjectURL(file);
      setPhotos((current) => [...current, { id, url: previewUrl, caption: '', uploading: true }]);

      try {
        const secureUrl = await uploadImage(file);
        setPhotos((current) =>
          current.map((photo) => (photo.id === id ? { ...photo, url: secureUrl, uploading: false } : photo)),
        );
        URL.revokeObjectURL(previewUrl);
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : 'Upload failed.';
        setPhotos((current) =>
          current.map((photo) =>
            photo.id === id ? { ...photo, uploading: false, failed: true, errorMessage: message } : photo,
          ),
        );
      }
    }
  };

  const updateCaption = (id: string, caption: string) => {
    setPhotos((current) => current.map((photo) => (photo.id === id ? { ...photo, caption } : photo)));
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => current.filter((photo) => photo.id !== id));
  };

  const clearDraft = () => {
    window.localStorage.removeItem(CREATOR_DRAFT_KEY);
    setGeneratedUrl('');
    setDraftStatus('Saved draft cleared.');
  };

  const generate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (!payload.receiverName || !payload.senderName || !payload.letter) {
      setFormError('Receiver, sender, and final letter are required.');
      return;
    }

    if (pin && !/^\d{4}$/.test(pin)) {
      setFormError('PIN must be exactly 4 digits, or leave it blank.');
      return;
    }

    if (youtubeUrl.trim() && !youtubeId) {
      setFormError('Please enter a valid YouTube video URL or leave it blank.');
      return;
    }

    if (photos.some((photo) => photo.uploading)) {
      setFormError('Please wait for the photo uploads to finish.');
      return;
    }

    if (photos.some((photo) => photo.failed)) {
      setFormError('Remove failed uploads or upload them again before generating the link.');
      return;
    }

    const encoded = encodePayload(payload);
    setGeneratedUrl(`${getGiftBaseUrl()}/?payload=${encoded}`);
    setCopyLabel('Copy');
  };

  const copyUrl = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopyLabel('Copied');
    window.setTimeout(() => setCopyLabel('Copy'), 1400);
  };

  const canRenderQrCode = generatedUrl.length > 0 && generatedUrl.length <= MAX_QR_CODE_TEXT_LENGTH;

  return (
    <main className="creator-shell">
      <section className="creator-card">
        <div className="creator-brand">
          <span className="creator-logo">For You</span>
          <span className="creator-pill">Private link gift</span>
        </div>

        <div className="creator-heading">
          <p className="creator-kicker">Cinematic love letter builder</p>
          <h1>Make a memory box they can scroll through.</h1>
          <p className="creator-subcopy">
            Add up to six photos, captions, a Spotify track, and a final handwritten note. Everything is packed into one
            encoded share link.
          </p>
          {draftStatus && (
            <p className="draft-status">
              {draftStatus}
              <button type="button" onClick={clearDraft}>
                Clear saved draft
              </button>
            </p>
          )}
        </div>

        <form className="creator-form" onSubmit={generate}>
          <div className="creator-grid">
            <label className="field">
              <span>Receiver name</span>
              <input value={receiverName} onChange={(event) => setReceiverName(event.target.value)} placeholder="Aarohi" />
            </label>
            <label className="field">
              <span>Sender name</span>
              <input value={senderName} onChange={(event) => setSenderName(event.target.value)} placeholder="Varun" />
            </label>
          </div>

          <section className="creator-section">
            <div className="section-title">
              <h2>Photos</h2>
              <p>{uploadedPhotoCount}/6 uploaded</p>
            </div>
            <label className="dropzone">
              <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={photos.length >= 6 || uploading} />
              <span>Drop or choose photos</span>
              <small>Each photo can have its own handwritten caption.</small>
            </label>

            {photos.length > 0 && (
              <div className="upload-grid">
                {photos.map((photo, index) => (
                  <article className={`upload-tile ${photo.failed ? 'failed' : ''}`} key={photo.id}>
                    <img src={photo.url} alt="" />
                    <div>
                      <span>{photo.uploading ? 'Uploading...' : `Memory ${index + 1}`}</span>
                      <button type="button" onClick={() => removePhoto(photo.id)} aria-label="Remove photo">
                        Remove
                      </button>
                    </div>
                    <input
                      value={photo.caption}
                      onChange={(event) => updateCaption(photo.id, event.target.value)}
                      placeholder="Caption for this memory"
                    />
                    {photo.failed && <small>Upload failed: {photo.errorMessage || 'Remove and try again.'}</small>}
                  </article>
                ))}
              </div>
            )}
          </section>

          <label className="field">
            <span>Spotify track URL</span>
            <input
              value={spotifyUrl}
              onChange={(event) => setSpotifyUrl(event.target.value)}
              placeholder="https://open.spotify.com/track/..."
            />
          </label>

          {trackId && (
            <div className="spotify-preview">
              <iframe
                title="Spotify preview"
                src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
                width="100%"
                height="80"
                allow="autoplay; clipboard-write; compute-pressure; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          )}

          <label className="field">
            <span>YouTube video URL (optional)</span>
            <input
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </label>

          {youtubeId && (
            <div className="youtube-preview">
              <img src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt="YouTube preview thumbnail" />
              <div>
                <span>YouTube preview ready</span>
                <small>{youtubeId}</small>
              </div>
            </div>
          )}

          <label className="field">
            <span>Final letter</span>
            <textarea value={letter} onChange={(event) => setLetter(event.target.value)} rows={9} />
          </label>

          <label className="field small-field">
            <span>Optional 4-digit PIN</span>
            <input
              value={pin}
              inputMode="numeric"
              maxLength={4}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
            />
          </label>

          {(formError || error) && <p className="form-error">{formError || error}</p>}

          <button className="primary-action" type="submit">
            Generate Gift Link
          </button>
        </form>

        {generatedUrl && (
          <section className="result-card">
            <div>
              <h2>Your link is ready</h2>
              <p>{generatedUrl}</p>
              <div className="result-actions">
                <button type="button" onClick={copyUrl}>
                  {copyLabel}
                </button>
                <button type="button" onClick={() => window.open(generatedUrl, '_blank', 'noopener,noreferrer')}>
                  Preview
                </button>
              </div>
            </div>
            {canRenderQrCode ? (
              <QRCodeSVG value={generatedUrl} size={132} bgColor="#fffaf4" fgColor="#4a3740" level="L" />
            ) : (
              <div className="qr-fallback">
                <span>QR skipped</span>
                <small>This link is too long for a reliable QR code. Copy the link instead.</small>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
