const topicModel = require('../models/topicModel');

async function index(req, res) {
  try {
    const keyword = req.query.keyword || '';
    const topics = await topicModel.getAllTopics(keyword);

    res.render('topics/index', {
      topics,
      keyword
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

function showCreate(req, res) {
  res.render('topics/create', { error: null, values: {} });
}

async function create(req, res) {
  try {
    const { code, title, student_name, field, advisor } = req.body;

    if (!code || !title || !student_name || !field || !advisor) {
      return res.status(400).render('topics/create', {
        error: 'Vui long nhap day du thong tin.',
        values: req.body
      });
    }

    await topicModel.createTopic({
      code: code.trim(),
      title: title.trim(),
      student_name: student_name.trim(),
      field: field.trim(),
      advisor: advisor.trim()
    });

    res.redirect('/topics');
  } catch (error) {
    res.status(400).render('topics/create', {
      error: error.message,
      values: req.body
    });
  }
}

async function showEdit(req, res) {
  try {
    const topic = await topicModel.getTopicById(req.params.id);

    if (!topic) {
      return res.status(404).send('Khong tim thay de tai.');
    }

    res.render('topics/edit', { topic, error: null });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function update(req, res) {
  try {
    const { title, student_name, field, advisor } = req.body;

    if (!title || !student_name || !field || !advisor) {
      return res.status(400).render('topics/edit', {
        topic: { id: req.params.id, ...req.body },
        error: 'Vui long nhap day du thong tin.'
      });
    }

    const result = await topicModel.updateTopic(req.params.id, {
      title: title.trim(),
      student_name: student_name.trim(),
      field: field.trim(),
      advisor: advisor.trim()
    });

    if (result.changes === 0) {
      return res.status(404).send('Khong tim thay de tai.');
    }

    res.redirect('/topics');
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function destroy(req, res) {
  try {
    await topicModel.deleteTopic(req.params.id);
    res.redirect('/topics');
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  index,
  showCreate,
  create,
  showEdit,
  update,
  destroy
};
