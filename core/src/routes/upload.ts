import { Router, Request, Response} from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
});

const storageClient = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEYFILE,
});
const bucket = storageClient.bucket(process.env.GCLOUD_STORAGE_BUCKET!);

router.post('/', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  const filename = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(filename);

  const stream = file.createWriteStream({
    resumable: false,
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on('error', (err) => {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Error uploading file.' });
  });

  stream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    res.status(200).json({ url: publicUrl });
  });

  stream.end(req.file.buffer);
});

export default router;
