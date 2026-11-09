
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const uploadDir = fileURLToPath(new URL('../uploads/', import.meta.url));
mkdirSync(uploadDir, { recursive: true });

const allowedTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    const extension = allowedTypes.get(file.mimetype);
    if (!extension) {
      return callback(new Error('Only JPG, PNG, WEBP and GIF images are allowed.'));
    }

    return callback(null, `${randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (!allowedTypes.has(file.mimetype)) {
    return callback(new Error('Invalid image format. Use JPG, PNG, WEBP or GIF.'));
  }

  return callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export default upload;
