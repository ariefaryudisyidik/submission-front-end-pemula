const books = [];
const RENDER_EVENT = 'render-book';

function addBook() {
  const titleBook = document.getElementById('titleBook').value;
  const authorBook = document.getElementById('authorBook').value;
  const yearsBook = document.getElementById('yearsBook').value;
  const isCompleted = document.getElementById('isCompleted');

  let status;
  if (isCompleted.checked) {
    status = true;
  } else {
    status = false;
  }

  books.push({
    id: +new Date(),
    title: titleBook,
    author: authorBook,
    year: Number(yearsBook),
    isCompleted: status,
  });

  document.dispatchEvent(new Event(RENDER_EVENT));
  if (isStorageExist()) {
    saveData();
    alert('Data berhasil disimpan');
  }
}

document.addEventListener(RENDER_EVENT, function () {
  const unCompleted = document.getElementById('unComplete');
  unCompleted.innerHTML = '';

  const isCompleted = document.getElementById('isComplete');
  isCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      unCompleted.append(bookElement);
    } else {
      isCompleted.append(bookElement);
    }
  }
});

function makeBook(objectBook) {
  const { id, title, author, year, isCompleted } = objectBook;

  const textTitle = document.createElement('p');
  textTitle.classList.add('itemTitle');
  textTitle.innerHTML = title;

  const textAuthor = document.createElement('p');
  textAuthor.classList.add('itemAuthor');
  textAuthor.innerText = author;

  const textYear = document.createElement('p');
  textYear.classList.add('itemYear');
  textYear.innerText = year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('itemText');
  textContainer.append(textTitle, textAuthor, textYear);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('itemAction');

  const container = document.createElement('div');
  container.classList.add('item');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undoButton');
    undoButton.innerHTML = `<i class='bx bx-undo'></i>`;

    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trashButton');
    trashButton.innerHTML = `<i class='bx bx-trash'></i>`;

    trashButton.addEventListener('click', function () {
      customDialog(id);
    });

    actionContainer.append(undoButton, trashButton);
    container.append(actionContainer);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('checkButton');
    checkButton.innerHTML = `<i class='bx bx-check'></i>`;

    checkButton.addEventListener('click', function () {
      addBookToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trashButton');
    trashButton.innerHTML = `<i class='bx bx-trash'></i>`;

    trashButton.addEventListener('click', function () {
      customDialog(id);
    });

    actionContainer.append(checkButton, trashButton);
    container.append(actionContainer);
  }
  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

document.addEventListener('DOMContentLoaded', function () {
  const saveForm = document.getElementById('bookForm');
  saveForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function searchBook() {
  const searchInput = document.getElementById('search').value.toLowerCase();
  const bookTitles = document.querySelectorAll('.itemTitle');

  for (const title of bookTitles) {
    const bookTitleText = title.innerText.toLowerCase();
    const bookItem = title.closest('.item');

    if (bookTitleText.includes(searchInput)) {
      bookItem.style.display = 'flex';
    } else {
      bookItem.style.display = 'none';
    }
  }
}

function customDialog(id) {
  const customDialog = document.createElement('div');
  customDialog.id = 'customDialog';
  customDialog.classList.add('custom-dialog');

  const dialogContent = document.createElement('div');
  dialogContent.classList.add('dialog-content');

  const dialogHeader = document.createElement('div');
  dialogHeader.classList.add('dialog-header');

  const dialogTitle = document.createElement('h2');
  dialogTitle.textContent = 'Konfirmasi Hapus';

  dialogHeader.appendChild(dialogTitle);

  const dialogMessage = document.createElement('p');
  dialogMessage.textContent = 'Anda yakin ingin menghapus buku ini?';

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const confirmDeleteButton = document.createElement('button');
  confirmDeleteButton.id = 'confirmDelete';
  confirmDeleteButton.classList.add('delete-button');
  confirmDeleteButton.textContent = 'Hapus';

  const cancelDeleteButton = document.createElement('button');
  cancelDeleteButton.id = 'cancelDelete';
  cancelDeleteButton.classList.add('cancel-button');
  cancelDeleteButton.textContent = 'Batal';

  buttonContainer.appendChild(confirmDeleteButton);
  buttonContainer.appendChild(cancelDeleteButton);

  dialogContent.appendChild(dialogHeader);
  dialogContent.appendChild(dialogMessage);
  dialogContent.appendChild(buttonContainer);

  customDialog.appendChild(dialogContent);

  confirmDeleteButton.addEventListener('click', function () {
    removeBookFromCompleted(id);
    customDialog.style.display = 'none';
    setTimeout(() => {
      alert('Data berhasil dihapus');
    }, 100);
  });

  cancelDeleteButton.addEventListener('click', function () {
    customDialog.style.display = 'none';
  });

  // Tambahkan customDialog ke dalam dokumen
  document.body.append(customDialog);
}
