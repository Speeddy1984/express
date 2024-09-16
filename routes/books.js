const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

class Book {
  constructor(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  ) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

let books = [];

// Получить все книги
router.get("/", (req, res) => {
  res.json(books);
});

// Получить книгу по ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);

  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Книга не найдена");
  }
});

// Создать книгу с загрузкой файла
router.post("/", upload.single("fileBook"), (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const fileBook = req.file ? req.file.path : "";
  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );
  books.push(newBook);
  res.status(201).json(newBook);
});

// Редактировать книгу по ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;
  const book = books.find((b) => b.id === id);

  if (book) {
    book.title = title || book.title;
    book.description = description || book.description;
    book.authors = authors || book.authors;
    book.favorite = favorite !== undefined ? favorite : book.favorite;
    book.fileCover = fileCover || book.fileCover;
    book.fileName = fileName || book.fileName;
    book.fileBook = fileBook || book.fileBook;
    res.json(book);
  } else {
    res.status(404).send("Книга не найдена");
  }
});

// Удалить книгу по ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    res.send("ok");
  } else {
    res.status(404).send("Книга не найдена");
  }
});

// Скачать файл книги по ID
router.get("/:id/download", (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);

  if (book && book.fileBook) {
    res.download(book.fileBook);
  } else {
    res.status(404).send("Файл не найден");
  }
});

module.exports = router;
