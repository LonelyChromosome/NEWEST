const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Khong the mo SQLite:', err.message);
    return;
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      student_name TEXT NOT NULL,
      field TEXT NOT NULL,
      advisor TEXT NOT NULL
    )
  `, (createErr) => {
    if (createErr) {
      console.error('Khong the tao bang topics:', createErr.message);
      return;
    }

    db.get('SELECT COUNT(*) AS total FROM topics', (countErr, row) => {
      if (countErr || !row || row.total > 0) return;

      const stmt = db.prepare(`
        INSERT INTO topics (code, title, student_name, field, advisor)
        VALUES (?, ?, ?, ?, ?)
      `);

      [
        ['DT001', 'Ung dung AI trong giao duc', 'Nguyen Van An', 'AI', 'TS. Tran Minh'],
        ['DT002', 'He thong quan ly thu vien', 'Le Thi Binh', 'Web', 'ThS. Nguyen Hoa'],
        ['DT003', 'Nhan dien khuon mat', 'Pham Quang Huy', 'Computer Vision', 'TS. Do Anh']
      ].forEach((topic) => stmt.run(topic));

      stmt.finalize();
    });
  });
});

module.exports = db;
