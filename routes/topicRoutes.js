const express = require('express');
const topicController = require('../controllers/topicController');

const router = express.Router();

router.get('/', topicController.index);

router.get('/create', topicController.showCreate);
router.post('/create', topicController.create);

router.get('/edit/:id', topicController.showEdit);
router.post('/edit/:id', topicController.update);

router.post('/delete/:id', topicController.destroy);

module.exports = router;
