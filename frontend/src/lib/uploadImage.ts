const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_URL}/uploads/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const result = await response.json().catch(() => null) as {
    error?: unknown;
    message?: unknown;
    image_url?: unknown;
  } | null;

  if (!response.ok) {
    const message = result?.error ?? result?.message;
    throw new Error(typeof message === 'string' ? message : 'Image upload failed');
  }

  if (typeof result?.image_url !== 'string') {
    throw new Error('Image upload response did not include an image URL');
  }

  return result.image_url;
}
