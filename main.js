document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const searchInput = document.getElementById("searchBookTitle");

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchInput.addEventListener("input", function () {
    renderBooks(this.value);
  });

  function addBook() {
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    const bookId = new Date().getTime().toString();

    const bookData = {
      id: bookId,
      title,
      author,
      year,
      isComplete,
    };

    saveBookToLocalStorage(bookData);
    renderBooks();
    bookForm.reset();
  }

  function saveBookToLocalStorage(book) {
    const books = getBooksFromLocalStorage();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  function getBooksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("books") || "[]").map((book) => ({
      ...book,
      year: Number(book.year),
    }));
  }

  function renderBooks(searchTerm = "") {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    const books = getBooksFromLocalStorage().filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()));

    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function createBookElement(book) {
    const bookContainer = document.createElement("div");
    bookContainer.setAttribute("data-bookid", book.id);
    bookContainer.setAttribute("data-testid", "bookItem");

    const title = document.createElement("h3");
    title.setAttribute("data-testid", "bookItemTitle");
    title.innerText = book.title;

    const author = document.createElement("p");
    author.setAttribute("data-testid", "bookItemAuthor");
    author.innerText = `Penulis: ${book.author}`;

    const year = document.createElement("p");
    year.setAttribute("data-testid", "bookItemYear");
    year.innerText = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    toggleButton.addEventListener("click", function () {
      toggleBookStatus(book.id);
    });

    const editButton = document.createElement("button");
    editButton.innerText = "Edit Buku";
    editButton.addEventListener("click", function () {
      editBook(book);
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", function () {
      deleteBook(book.id);
    });

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    bookContainer.appendChild(title);
    bookContainer.appendChild(author);
    bookContainer.appendChild(year);
    bookContainer.appendChild(buttonContainer);

    return bookContainer;
  }

  function toggleBookStatus(bookId) {
    const books = getBooksFromLocalStorage();
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        return { ...book, isComplete: !book.isComplete };
      }
      return book;
    });
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    renderBooks();
  }

  function deleteBook(bookId) {
    const books = getBooksFromLocalStorage().filter((book) => book.id !== bookId);
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
  }

  function editBook(book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;
    deleteBook(book.id);
  }

  renderBooks();
});
