import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as userController from './controllers/userController.js'
import * as postController from './controllers/postController.js'
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));


const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads'),
  file: (_, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.post('/auth/register',registerValidation, handleValidationErrors, userController.register);
app.post('/auth/login', loginValidation,  handleValidationErrors, userController.login)
app.get('/auth/me', checkAuth, userController.getMe);

app.post('/upload',checkAuth, upload.single('image'), (req, res) => {
  res.json(
    {
      url: `/upload/${req.file.originalname}`,
    }
  )
});
app.get('/posts', postController.getAll);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create);
app.get('/posts/:id', postController.getOne);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, postController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Server ok')
});
