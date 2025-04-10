const ForumPost = require('../models/ForumPost');

exports.getAllPosts = (req, res) => {
    ForumPost.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getPostById = (req, res) => {
    ForumPost.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Post not found' });
        res.json(results[0]);
    });
};

exports.createPost = (req, res) => {
    const newPost = req.body;
    ForumPost.create(newPost, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Post created', id: result.insertId });
    });
};

exports.updatePost = (req, res) => {
    const updatedPost = req.body;
    ForumPost.update(req.params.id, updatedPost, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post updated' });
    });
};

exports.deletePost = (req, res) => {
    ForumPost.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post deleted' });
    });
};
