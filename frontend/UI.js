import BookService from './services/BookService';
const bookService = new BookService();

import { format } from 'timeago.js';

// Funciones para renderizar los libros en el DOM y ejecutar acciones sobre ellos

class renderBooks {
  async renderBooks(updated = false) {
    const books = await bookService.getBooks();
    const booksCardContainer = document.getElementById('books-cards');
    booksCardContainer.innerHTML = '';
    books.forEach(book => {
      const div = document.createElement('div');
      div.className = '';
      div.innerHTML = `
        <div class="card m-2">
          <div class="row">
            <div class="card-header d-flex justify-content-end">
              <button class="btn btn-sm btn-primary edit" _id="${book._id}">
                Edit
              </button>
            </div>
            <div class="col-md-4">
              <img src="http://localhost:3000${book.imagePath}" class="img-fluid" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-block">
                <h4 class="card-title">${book.title}</h4>
                <p class="card-text">${book.author}</p>
                <a href="#" class="btn btn-danger delete" _id="${book._id}">Delete</a>
              </div>
            </div>
          </div>
          <div class="card-footer">
            ${book.created_updated}: ${format(book.created_at)}
          </div>
        </div>
      `
      booksCardContainer.appendChild(div);
    })
  }
  // arreglar esto :) ${updated ? 'Updated:' : 'Created:'} ${format(book.created_at)}
  async addANewBook(book) {
    try {
      await bookService.postBook(book);
      this.clearBookForm();
      this.renderBooks();
      this.renderMessage('New book added successfully', 'success', 3000);
    } catch (error) {
      console.error('Error adding book:', error);
      this.renderMessage('Error adding book', 'danger', 3000);
    }
  }

  clearBookForm() {
    document.getElementById('book-form').reset();
    const submitButton = document.querySelector('#book-form button[type="submit"]')
    submitButton.removeAttribute('_id');
    submitButton.classList.remove('update-submit');
    submitButton.textContent = 'Save Book';
  }

  renderMessage(message, colorMessage, secondsToRemove) {
    const div = document.createElement('div');
    div.className = `alert alert-${colorMessage} message`;
    div.appendChild(document.createTextNode(message)); // :O esto no lo sabia :O normalmente usaba textContent

    const container = document.querySelector('.col-md-4');
    const bookForm = document.querySelector('#book-form');

    container.insertBefore(div, bookForm);

    setTimeout(() => {
      document.querySelector('.message').remove();
    }, secondsToRemove);
  }

  async getOneBook(bookId) {
    const book = await bookService.getOneBook(bookId);
    return book;
  }

  async updateBook(bookId, newBook) {
    await bookService.updateBook(bookId, newBook);
    this.clearBookForm();
    this.renderBooks(true);
    this.renderMessage('Book updated successfully', 'warning', 3000);
  }

  async deleteBook(bookId) {
    await bookService.deleteBook(bookId);
    this.renderBooks();
    this.renderMessage('Book removed successfully', 'danger', 3000);
  }
}

export default renderBooks;