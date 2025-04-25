// Funcionalidades generales para interactuar con el DOM
import './styles/app.css';
import UI from './UI';

const ui = new UI();
ui.renderBooks();

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value || '';
    const author = document.getElementById('author').value || '';
    const isbn = document.getElementById('isbn').value || '';
    const image = document.getElementById('image').files[0] || null;
    const submitButton = document.querySelector('#book-form button[type="submit"]')
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('isbn', isbn);
    
    // Solo añadir la imagen al FormData si se seleccionó un archivo
    if (image) {
      formData.append('image', image);
    }
    
    const ui = new UI();

    if (!submitButton.classList.contains('update-submit')) {
      ui.addANewBook(formData);
    } else {
      ui.updateBook(submitButton.getAttribute('_id'), formData);
    }
  });
  
  document.getElementById('books-cards').addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.target.classList.contains('delete')) {
      ui.deleteBook(e.target.getAttribute('_id'));
    }
    
    if (e.target.classList.contains('edit')) {
      const id = e.target.getAttribute('_id');
      const currentBook = await ui.getOneBook(id);
      document.getElementById('title').value = currentBook.title;
      document.getElementById('author').value = currentBook.author;
      document.getElementById('isbn').value = currentBook.isbn;
      const submitButton = document.querySelector('#book-form button[type="submit"]')
      submitButton.textContent = 'Update Book';
      submitButton.classList.add('update-submit');
      submitButton.setAttribute('_id', id);
    }
  });
})

