import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as userController from './controllers/userController.js'
import * as postController from './controllers/postController.js'
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose.connect(
  'mongodb+srv://admin:laEyeU42mYqWpgHy@cluster0.opxl2tc.mongodb.net/blog?retryWrites=true&w=majority'
).then(() => console.log('db connection established'))
  .catch((err) => console.log('db error: ' + err));

const app = express();
const port = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads'),
  file: (_, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use(express.static('mods'));

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

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Server ok')
});
