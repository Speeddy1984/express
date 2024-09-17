const express = require('express');
const err404 = require('./middleware/err404')
const err5XX = require('./middleware/err5XX')
const app = express();
app.use(express.json());

const booksRouter = require('./routes/books');

// Авторизация пользователя
app.post('/api/user/login', (req, res) => {
    res.status(201).json({
        id: 1,
        mail: 'test@mail.ru'
    });
});

// Роут для книг
app.use('/api/books', booksRouter);

app.use(err404);
app.use(err5XX);

app.listen(3000, () => {
  console.log(`Сервер запущен на порте 3000`);
});
