const express = require('express');
const path = require('path');
const topicRoutes = require('./routes/topicRoutes');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/topics', topicRoutes);
app.get('/', (req, res) => res.redirect('/topics'));
app.use((req, res) => res.status(404).send('404 - Không tìm thấy trang'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Có lỗi xảy ra trong quá trình xử lý.');
});
app.listen(3000, () => console.log('http://localhost:3000/topics'));
