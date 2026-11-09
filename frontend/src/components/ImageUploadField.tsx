import { useState, type ChangeEvent } from 'react';
import { uploadImage } from '@/lib/uploadImage';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Choose a JPG, PNG, WEBP or GIF image.');
      input.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image size must be 5 MB or less.');
      input.value = '';
      return;
    }

    setBusy(true);
    try {
      onChange(await uploadImage(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed');
    } finally {
      setBusy(false);
      input.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
      <input
        type="url"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="https://..."
        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
      />
      <label className="block text-sm font-medium text-stone-700 mt-3 mb-1">
        Upload image (JPG, PNG, WEBP or GIF; max 5 MB)
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        disabled={busy}
        className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:font-medium file:text-stone-700 hover:file:bg-stone-200 disabled:opacity-50"
      />
      {busy && <p className="mt-2 text-sm text-stone-500">Uploading image...</p>}
      {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
      {value && (
        <img
          src={value}
          alt="Image preview"
          className="mt-3 h-28 w-44 rounded-lg border border-stone-200 bg-stone-50 object-cover"
        />
      )}
    </div>
  );
}
