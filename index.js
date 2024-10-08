const express = require('express');
const err404 = require('./middleware/err404')
const err5XX = require('./middleware/err5XX')
const app = express();

const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/library';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Успешно подключено к MongoDB'))
.catch((err) => console.error('Ошибка подключения к MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const booksRouter = require('./routes/books');
const apiBooksRouter = require('./api/apiBooks');  // Роуты для API

// Авторизация пользователя, пока оставляем. Возможно, пригодится позже
app.post('/api/user/login', (req, res) => {
    res.status(201).json({
        id: 1,
        mail: 'test@mail.ru'
    });
});

// Роуты для API, оставить для будущих задач
app.use('/api/books', apiBooksRouter);

// new! Роуты для многостраничного интерфейса
app.use('/books', booksRouter);

// Роуты для обработки ошибок
app.use(err404);
app.use(err5XX);

app.listen(3000, () => {
  console.log(`Сервер запущен на порте 3000`);
});
