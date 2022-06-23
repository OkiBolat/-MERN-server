import { body } from 'express-validator';

export const registerValidation = [
  body('email','Invalid mail format').isEmail(),
  body('password', 'Password must be at least 5 characters long').isLength({ min: 5}),
  body('fullName', 'Please enter a name').isLength({ min: 3}),
  body('avatarUrl', 'Invalid avatar link').optional().isURL(),
];

export const loginValidation = [
  body('email','Invalid mail format').isEmail(),
  body('password', 'Password must be at least 5 characters long').isLength({ min: 5}),
];

export const postCreateValidation = [
  body('title', 'Please enter a title').isLength({ min: 3 }).isString(),
  body('text', 'Please enter a text').isLength({ min: 3 }).isString(),
  body('tags', 'No validation tags').optional().isString(),
  body('imageUrl', 'No validation image URL').optional().isString(),
];
