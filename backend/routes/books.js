const { Router } = require('express');
const router = Router();
const {unlink} = require('fs-extra'); // variacion del modulo fs de node para manejar archivos
const path = require('path');

// Este archivo se encarga de manejar las rutas de los libros y las peticiones que se hacen a ellos
// Actua sobre la base de datos :)

const Book = require('../models/Book');

router.get('/', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving book', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const {title, author, isbn} = req.body;
  const imagePath = '/uploads/' + req.file.filename;
  const newBook = new Book({title, author, isbn, imagePath});
  await newBook.save();
  res.json({message: 'Book saved'});
})

router.put('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {title, author, isbn} = req.body;
    
    // Verificar si los campos requeridos están presentes
    if (!title || !author || !isbn) {
      return res.status(400).json({ message: 'Title, author and ISBN are required' });
    }
    
    // Obtener el libro actual para mantener la imagen si no se sube una nueva
    const currentBook = await Book.findById(id);
    if (!currentBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Manejar el caso en que no se suba una imagen
    let imagePath = currentBook.imagePath;
    if (req.file) {
      // Si hay una nueva imagen, actualizar la ruta
      imagePath = '/uploads/' + req.file.filename;
      
      // Eliminar la imagen anterior si existe
      if (currentBook.imagePath) {
        try {
          unlink(path.resolve('./backend/public' + currentBook.imagePath));
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    }
    
    const updatedBook = {title, author, isbn, imagePath, created_updated: 'Updated', created_at: Date.now()};
    await Book.findByIdAndUpdate(id, updatedBook);
    res.json({message: 'Book updated'});
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
})

router.delete('/:id', async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  unlink(path.resolve('./backend/public/' + book.imagePath));
  res.json({message: 'Book deleted'});
})

module.exports = router;