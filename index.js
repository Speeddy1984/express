const express = require("express");
const { v4: uuid } = require("uuid");

class Book {
  constructor(
    title = "",
    description = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = ""
  ) {
    this.id = uuid();
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
  }
}

const app = express();

app.use(express.json());

let books = [];

// Авторизация пользователя
app.post("/api/user/login", (req, res) => {
  res.status(201).json({
    id: 1,
    mail: "test@mail.ru",
  });
});

// Получить все книги
app.get("/api/books", (req, res) => {
  res.json(books);
});

// Получить книгу по ID
app.get("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);

  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Книга не найдена");
  }
});

// Создать книгу
app.post("/api/books", (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );
  books.push(newBook);
  res.status(201).json(newBook);
});

// Редактировать книгу по ID
app.put("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const book = books.find((b) => b.id === id);

  if (book) {
    book.title = title || book.title;
    book.description = description || book.description;
    book.authors = authors || book.authors;
    book.favorite = favorite || book.favorite;
    book.fileCover = fileCover || book.fileCover;
    book.fileName = fileName || book.fileName;
    res.json(book);
  } else {
    res.status(404).send("Книга не найдена");
  }
});

// Удалить книгу по ID
app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    res.send("Книга удалена");
  } else {
    res.status(404).send("Книга не найдена");
  }
});

app.listen(3000, () => {
  console.log(`Сервер запущен на порте 3000`);
});
