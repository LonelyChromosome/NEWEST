const db = require('../config/db');

function getAll(keyword = '') {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM topics ORDER BY id DESC', [], (err, rows) =>
      err ? reject(err) : resolve(rows)
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
    const sql = `INSERT INTO topics(code, title, student_name, field, advisor, status)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql,
      [data.code, data.title, data.student_name, data.field, data.advisor, 'Đề xuất'],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function update(id, data) {
  return Promise.resolve();
}

function deleteTopic(id) {
  return Promise.resolve();
}

module.exports = { getAll, getById, create, update, deleteTopic };
