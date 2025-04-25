class BookService {
  constructor() {
    this.URI = 'http://localhost:3000/api/books';
  }

  async getBooks() {
    const response = await fetch(this.URI); // Devuelve un string legible
    const books = await response.json(); // Se convierte a un objeto json
    return books;
  }

  async getOneBook(bookId) {
    const response = await fetch(`${this.URI}/${bookId}`);
    const book = await response.json();
    return book;
  }

  async postBook(book) {
    const response = await fetch(this.URI, {
      method: 'POST',
      body: book,
    });
    const data = await response.json();
  }

  async updateBook(bookId, book) {
    const response = await fetch(`${this.URI}/${bookId}`, {
      method: 'PUT',
      body: book,
    });
    const data = await response.json();
    return data;
  }
  async deleteBook(bookId) {
    const response = await fetch(`${this.URI}/${bookId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    });
    const data = await response.json();
    return data;
  }
}

export default BookService;