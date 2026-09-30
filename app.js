const express = require('express');
const path = require('path');
const topicRoutes = require('./routes/topicRoutes');
require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/topics'));
app.use('/topics', topicRoutes);

app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/topics`);
});
