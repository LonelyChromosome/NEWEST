const db = require('../config/db');

function getAll(keyword = '') {
  return new Promise((resolve, reject) => {
    const value = keyword.trim();

    if (!value) {
      db.all('SELECT * FROM topics ORDER BY id DESC', [], (err, rows) =>
        err ? reject(err) : resolve(rows)
      );
      return;
    }

    const pattern = `%${value}%`;
    const sql = `
      SELECT * FROM topics
      WHERE code LIKE ?
         OR title LIKE ?
         OR student_name LIKE ?
         OR field LIKE ?
      ORDER BY id DESC
    `;

    db.all(
      sql,
      [pattern, pattern, pattern, pattern],
      (err, rows) => err ? reject(err) : resolve(rows)
    );
  });
}

function getById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM topics WHERE id = ?', [id], (err, row) =>
      err ? reject(err) : resolve(row)
    );
  });
}

function create(data) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO topics(code, title, student_name, field, advisor, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [data.code, data.title, data.student_name, data.field, data.advisor, 'Đề xuất'],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function update(id, data) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE topics
      SET title = ?, student_name = ?, field = ?, advisor = ?
      WHERE id = ?
    `;

    db.run(
      sql,
      [data.title, data.student_name, data.field, data.advisor, id],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

function deleteTopic(id) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM topics WHERE id = ?',
      [id],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

module.exports = { getAll, getById, create, update, deleteTopic };
