import path from 'node:path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.resolve('tmp'));
  },
});

export default multer({ storage });
