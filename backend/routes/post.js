const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User'); 
const authenticateToken = require('../middlewares/authenticateToken');
const { validatePost, uploadToCloudinary } = require('../middlewares/postMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add', authenticateToken, upload.single('file'), uploadToCloudinary, validatePost, async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();

        await User.findByIdAndUpdate(req.user.userId, { $push: { posts: savedPost._id } });
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        let posts;
        if (req.query.userId) {
            posts = await Post.find({ userId: req.query.userId })
                .populate('likes')
                .populate('comments.user');
        } else {
            posts = await Post.find()
                .populate('likes')
                .populate('comments.user');
        }
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('likes')
            .populate('comments.user');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id', authenticateToken, validatePost, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('likes')
            .populate('comments.user');
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await User.findByIdAndUpdate(deletedPost.userId, { $pull: { posts: req.params.id } });

        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id/like', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(req.user.userId)) {
            post.likes = post.likes.filter(like => like.toString() !== req.user.userId.toString());
        } else {
            post.likes.push(req.user.userId);
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/:id/comment', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ ...req.body, user: req.user.userId });

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;