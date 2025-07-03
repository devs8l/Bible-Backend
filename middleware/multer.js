/*import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });

export default upload;*/

import multer from 'multer';

const storage = multer.memoryStorage(); 

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export default upload;
