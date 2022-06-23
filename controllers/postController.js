import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.send(posts);
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Can not found posts',
    })
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Can not return post',
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Post not found',
          })
        }
        res.send(doc);
      }
    );

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Can not found posts',
    })
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      }, (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Can not delete post',
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Post not found',
          })
        }
        res.send({
          success: true,
        });
      }
    );

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Can not found posts',
    })
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });
    const post = await doc.save();
    res.send(post);
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Can not create post',
    })
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    )
    res.send({
      success: true,
    })
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: 'Can not update post',
    })
  }
};
