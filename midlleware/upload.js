import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.resolve('tmp'));
  },
  filename(req, file, callback) {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = crypto.randomUUID();

    callback(null, `${basename}-${suffix}${extname}`);
  },
});

export default multer({ storage });
