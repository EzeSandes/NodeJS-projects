import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

/*
|--------------------------------------------------------------------------
| Storage configuration
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: 'src/public/images/books',
  filename: (req, file, cb) => {
    // get the file extension
    const ext = path.extname(file.originalname);
    // generate a random UUID and add the extension
    const filename = crypto.randomUUID() + ext;
    // call the callback with the filename. See http://github.com/expressjs/multer?tab=readme-ov-file#storage
    cb(null, filename);
  },
});

/*
|--------------------------------------------------------------------------
| File filter (only images)
| See https://github.com/expressjs/multer?tab=readme-ov-file#filefilter 
|--------------------------------------------------------------------------
*/

function filefilter(req, file, cb) {
  const allowedtypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (!allowedtypes.includes(file.mimetype))
    return cb(new Error('Invalid file type'), false); // (error, boolean)

  cb(null, true); // (error, boolean)
}

/*
|--------------------------------------------------------------------------
| Multer instance
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,
  filefilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
});

export default upload;
