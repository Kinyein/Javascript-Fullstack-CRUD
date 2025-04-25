const {Schema, model} = require('mongoose');

// Modelo de los libros, define la estructura de los datos que se guardan en la base de datos sobre los libros en este caso

const bookSchema = new Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  isbn: {type: String, required: true},
  imagePath: {type: String, required: false}, // No guardar imagen en la base de datos, no es optimo
  created_at: {type: Date, default: Date.now},
  created_updated: {type: String, default: 'Created'}
})

module.exports = model('Book', bookSchema);

