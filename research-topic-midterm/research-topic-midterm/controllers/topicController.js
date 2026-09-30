const topicModel = require('../models/topicModel');

exports.index = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || '';
    const topics = await topicModel.getAll(keyword);
    res.render('topics/index', { topics, keyword });
  } catch (e) {
    next(e);
  }
};

exports.showCreate = (req, res) => {
  res.render('topics/create', { error: null, old: {} });
};

exports.create = async (req, res, next) => {
  try {
    const { code, title, student_name, field, advisor } = req.body;

    if (!code || !title || !student_name || !field || !advisor) {
      return res.status(400).render('topics/create', {
        error: 'Vui lòng nhập đủ thông tin.',
        old: req.body
      });
    }

    await topicModel.create({
      code: code.trim(),
      title: title.trim(),
      student_name: student_name.trim(),
      field: field.trim(),
      advisor: advisor.trim()
    });

    res.redirect('/topics');
  } catch (e) {
    next(e);
  }
};

exports.showEdit = async (req, res, next) => {
  try {
    const topic = await topicModel.getById(req.params.id);

    if (!topic) {
      return res.status(404).send('Không tìm thấy đề tài');
    }

    res.render('topics/edit', { topic });
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { title, student_name, field, advisor } = req.body;

    if (!title || !student_name || !field || !advisor) {
      return res.status(400).send('Vui lòng nhập đủ thông tin.');
    }

    await topicModel.update(req.params.id, {
      title: title.trim(),
      student_name: student_name.trim(),
      field: field.trim(),
      advisor: advisor.trim()
    });

    res.redirect('/topics');
  } catch (e) {
    next(e);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    await topicModel.deleteTopic(req.params.id);
    res.redirect('/topics');
  } catch (e) {
    next(e);
  }
};
