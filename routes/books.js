const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const axios = require("axios"); // Для отправки запросов к микросервису счётчика

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

// Главная страница с выводом списка книг
router.get("/", (req, res) => {
  res.render("index", { title: "Список книг", books });
});

// Страница для создания новой книги
router.get("/create", (req, res) => {
  res.render("books/create", { title: "Создать книгу" });
});

// Обработчик создания новой книги
router.post("/create", (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const newBook = new Book(
    title,
    description,
    authors,
    favorite === "true",
    fileCover,
    fileName,
    "" // здесь был/будет? файл, пока его нет
  );
  books.push(newBook);
  res.redirect("/books");
});

// Страница для просмотра книги по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);

  if (book) {
    try {
      // Увеличиваем счётчик просмотров через микросервис
      await axios.post(`http://counter-service:4000/counter/${book.id}/incr`);

      // Получаем текущее значение счётчика просмотров книги
      const counterResponse = await axios.get(
        `http://counter-service:4000/counter/${book.id}`
      );
      console.log(counterResponse.data);
      const counter = counterResponse.data.count;

      // Отображаем книгу и значение счётчика просмотров
      res.render("books/view", { book, counter });
    } catch (error) {
      console.error("Ошибка при работе со счётчиком:", error);
      res.render("books/view", {
        book,
        counter: "Ошибка получения счётчика просмотров",
      });
    }
  } else {
    res.render("errors/404", {
      title: "404 / Книга не найдена",
    });
  }
});

// Страница для редактирования книги
router.get("/:id/edit", (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);
  if (book) {
    res.render("books/update", { title: "Редактировать книгу", book });
  } else {
    res.render("errors/404", {
      title: "404 / Книга не найдена",
    });
  }
});

// Обработчик редактирования книги
router.post("/:id/edit", (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const book = books.find((b) => b.id === id);

  if (book) {
    book.title = title || book.title;
    book.description = description || book.description;
    book.authors = authors || book.authors;
    book.favorite = favorite === "true";
    book.fileCover = fileCover || book.fileCover;
    book.fileName = fileName || book.fileName;
    res.redirect(`/books/${id}`);
  } else {
    res.render("errors/404", {
      title: "404 / Книга не найдена",
    });
  }
});

module.exports = router;
