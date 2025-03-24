const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const authenticateToken = require('../middlewares/authenticateToken');
const { validatePost, uploadToCloudinary, deleteFromCloudinary } = require('../middlewares/postMiddleware');
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
        const posts = await Post.find()
            .populate('likes')
            .populate('comments.user');
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

router.put('/:id', authenticateToken, validatePost, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('likes')
            .populate('comments.user');
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }
        if (post.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (post.id) {
            await deleteFromCloudinary(post.id);
        }

        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        await User.findByIdAndUpdate(deletedPost.userId, { $pull: { posts: req.params.id } });

        res.json({ message: 'Post and associated image deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;