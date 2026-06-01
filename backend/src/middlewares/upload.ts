import multer from 'multer';
import path from 'path';

import crypto from 'crypto';

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads')); // Guardar en backend/uploads
  },
  filename: function (req, file, cb) {
    // Generar nombre único hasheado para la imagen (sin extensión)
    const hash = crypto.randomBytes(32).toString('hex');
    cb(null, hash);
  }
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limite 5MB
  }
});

export default upload;
