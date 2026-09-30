const db = require('../config/db');

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

async function getAllTopics(keyword = '') {
  const value = keyword.trim();

  if (!value) {
    return all('SELECT * FROM topics ORDER BY id DESC');
  }

  const pattern = `%${value}%`;
  return all(
    `SELECT * FROM topics
     WHERE code LIKE ?
        OR title LIKE ?
        OR student_name LIKE ?
        OR field LIKE ?
     ORDER BY id DESC`,
    [pattern, pattern, pattern, pattern]
  );
}

function getTopicById(id) {
  return get('SELECT * FROM topics WHERE id = ?', [id]);
}

function createTopic(topic) {
  return run(
    `INSERT INTO topics (code, title, student_name, field, advisor)
     VALUES (?, ?, ?, ?, ?)`,
    [topic.code, topic.title, topic.student_name, topic.field, topic.advisor]
  );
}

function updateTopic(id, topic) {
  return run(
    `UPDATE topics
     SET title = ?, student_name = ?, field = ?, advisor = ?
     WHERE id = ?`,
    [topic.title, topic.student_name, topic.field, topic.advisor, id]
  );
}

function deleteTopic(id) {
  return run('DELETE FROM topics WHERE id = ?', [id]);
}

module.exports = {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic
};
