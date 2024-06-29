const STORAGE_KEY = "STORAGE_KEY";

const formAddingBook = document.getElementById("inputBook");
const formSearchingBook = document.getElementById("searchBook");

function checkForStorage() {
  return typeof Storage !== "undefined";
}

formAddingBook.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const idTemp = document.getElementById("inputBookTitle").name;
  if (idTemp !== "") {
    const bookData = getBookList();
    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == idTemp) {
        bookData[index] = { ...bookData[index], title, author, year, isComplete };
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
    resetAllForm();
    renderBookList(bookData);
    return;
  }

  const id = JSON.parse(localStorage.getItem(STORAGE_KEY)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(STORAGE_KEY)).length + Date.now();
  const newBook = {
    id,
    title,
    author,
    year,
    isComplete,
  };

  putBookList(newBook);

  const bookData = getBookList();
  renderBookList(bookData);
});

function putBookList(data) {
  if (checkForStorage()) {
    let bookData = [];

    if (localStorage.getItem(STORAGE_KEY)) {
      bookData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }

    bookData.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
  }
}

function renderBookList(bookData) {
  const containerIncomplete = document.getElementById("incompleteBookshelfList");
  const containerComplete = document.getElementById("completeBookshelfList");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";

  if (!bookData) return;

  bookData.forEach(book => {
    const { id, title, author, year, isComplete } = book;

    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = `<h3 name="${id}">${title}</h3><p>Penulis: ${author}</p><p>Tahun: ${year}</p>`;

    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const greenButton = createButton("green", isComplete ? "Belum selesai" : "Selesai di Baca", () => {
      isCompleteBookHandler(bookItem);
    });

    const redButton = createButton("red", "Hapus buku", () => {
      deleteAnItem(bookItem);
    });

    containerActionItem.append(greenButton, redButton);
    bookItem.append(containerActionItem);

    if (isComplete === false) {
      containerIncomplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", () => {
        updateAnItem(bookItem);
      });
    } else {
      containerComplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", () => {
        updateAnItem(bookItem);
      });
    }
  });
}

function createButton(className, text, eventListener) {
  const button = document.createElement("button");
  button.classList.add(className);
  button.innerText = text;
  button.addEventListener("click", eventListener);
  return button;
}

function isCompleteBookHandler(itemElement) {
  const bookData = getBookList();
  if (!bookData) return;

  const title = itemElement.childNodes[0].innerText;
  const id = itemElement.childNodes[0].getAttribute("name");
  const updatedBookData = bookData.map(book => {
    if (book.title === title && book.id == id) {
      return { ...book, isComplete: !book.isComplete };
    }
    return book;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookData));
  renderBookList(updatedBookData);
}

function searchBookList(title) {
  const bookData = getBookList();
  if (!bookData) return;

  const searchTitle = title.toLowerCase();
  return bookData.filter(book => book.title.toLowerCase().includes(searchTitle));
}

function getBookList() {
  return checkForStorage() ? JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] : [];
}

function deleteAnItem(itemElement) {
  const bookData = getBookList();
  if (!bookData) return;

  const id = itemElement.childNodes[0].getAttribute("name");
  const updatedBookData = bookData.filter(book => book.id != id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookData));
  renderBookList(updatedBookData);
}

function updateAnItem(itemElement) {
  if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") {
    return;
  }

  const bookData = getBookList();
  if (!bookData) return;

  const id = itemElement.childNodes[0].getAttribute("name");
  const updatedBook = bookData.find(book => book.id == id);
  if (!updatedBook) return;

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(9);
  const year = parseInt(itemElement.childNodes[2].innerText.slice(7));
  const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;

  document.getElementById("inputBookTitle").value = title;
  document.getElementById("inputBookTitle").name = id;
  document.getElementById("inputBookAuthor").value = author;
  document.getElementById("inputBookYear").value = year;
  document.getElementById("inputBookIsComplete").checked = isComplete;

  const updatedBookData = bookData.map(book => {
    if (book.id == id) {
      return { ...book, title, author, year, isComplete };
    }
    return book;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookData));
}

formSearchingBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = document.getElementById("searchBookTitle").value;
  const bookList = searchBookList(title);
  renderBookList(bookList);
});

function resetAllForm() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    if (input.type === "text" || input.type === "number") {
      input.value = "";
    } else if (input.type === "checkbox") {
      input.checked = false;
    }
  });
}

window.addEventListener("load", function () {
  if (checkForStorage()) {
    if (localStorage.getItem(STORAGE_KEY)) {
      const bookData = getBookList();
      renderBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});


const darkModeToggle = document.getElementById("darkModeToggle");

let isDarkMode = localStorage.getItem("darkMode") === "true";

if (isDarkMode) {
  document.body.classList.add("dark-mode");
  darkModeToggle.textContent = "Light Mode";
} else {
  darkModeToggle.textContent = "Dark Mode";
}

darkModeToggle.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark-mode");

  localStorage.setItem("darkMode", isDarkMode);

  darkModeToggle.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
});