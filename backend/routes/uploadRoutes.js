
import { Router } from 'express';
import multer from 'multer';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please select an image.' });
  }

  return res.status(201).json({
    message: 'Image uploaded successfully.',
    image_url: `/uploads/${req.file.filename}`,
  });
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ error: error.message });
  }

  if (error) return res.status(400).json({ error: error.message });
  return next();
});

export default router;
