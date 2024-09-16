const express = require('express');
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

app.listen(3000, () => {
  console.log(`Сервер запущен на порте 3000`);
});
