// middlewares/upload.js
import multer from "multer";

const storage = multer.diskStorage({}); // default tmp storage
export const upload = multer({ storage });

export default upload;
