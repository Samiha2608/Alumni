const db = require('../config/db');

const ForumPost = {
    getAll: (callback) => {
        db.query('SELECT * FROM forum_posts', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM forum_posts WHERE id = ?', [id], callback);
    },

    create: (post, callback) => {
        db.query('INSERT INTO forum_posts (title, author, category, replies, status) VALUES (?, ?, ?, ?, ?)',
            [post.title, post.author, post.category, post.replies, post.status], callback);
    },

    update: (id, post, callback) => {
        db.query('UPDATE forum_posts SET title = ?, category = ?, status = ? WHERE id = ?',
            [post.title, post.category, post.status, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM forum_posts WHERE id = ?', [id], callback);
    }
};

module.exports = ForumPost;
