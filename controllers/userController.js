import jwt from 'jsonwebtoken';
import UserSchema from '../models/User.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserSchema({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    );

    const { passwordHash, ...userData } = user._doc

    res.json({ ...userData, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error register',
    });
  }
};

export const login =  async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      })
    };
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(403).json({
        message: 'login or password incorrect',
      })
    };
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    );

    const { passwordHash, ...userData } = user._doc

    res.json({ ...userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error auth',
    });
  }
};

export const getMe = async (req,res) => {
  try {
    const user = await UserSchema.findById(req.userId);

    if(!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    const { passwordHash, ...userData } = user._doc

    res.json({userData});

  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: 'Not Found',
    });
  }
}