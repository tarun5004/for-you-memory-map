'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
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

const sampleLetter =
  'I made this little place so our memories could live somewhere soft.\n\nEvery photo here is a tiny proof that ordinary days can turn into something I keep returning to.\n\nThank you for being you.';

const getSpotifyTrackId = (url: string) => url.match(/track\/([a-zA-Z0-9]+)/)?.[1] ?? '';

export default function CreatorForm() {
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
    setGeneratedUrl(`${window.location.origin}/?payload=${encodeURIComponent(encoded)}`);
    setCopyLabel('Copy');
  };

  const copyUrl = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopyLabel('Copied');
    window.setTimeout(() => setCopyLabel('Copy'), 1400);
  };

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
          <p>
            Add up to six photos, captions, a Spotify track, and a final handwritten note. Everything is packed into one
            encoded share link.
          </p>
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
            <QRCodeSVG value={generatedUrl} size={132} bgColor="#fffaf4" fgColor="#4a3740" />
          </section>
        )}
      </section>
    </main>
  );
}
