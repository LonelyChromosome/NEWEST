const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

router.get('/', topicController.index);
router.get('/new', topicController.showCreate);
router.post('/new', topicController.create);
router.get('/edit/:id', topicController.showEdit);
router.post('/edit/:id', topicController.update);
router.post('/delete/:id', topicController.destroy);

module.exports = router;
