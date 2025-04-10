const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.get('/', forumController.getAllPosts);
router.get('/:id', forumController.getPostById);
router.post('/', forumController.createPost);
router.put('/:id', forumController.updatePost);
router.delete('/:id', forumController.deletePost);

module.exports = router;
