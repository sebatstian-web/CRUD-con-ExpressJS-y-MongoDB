const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  fecha: {
    type: Date,
    default: Date.now
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  estado: {
    type: Boolean,
    default: true
  }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único.' });

module.exports = mongoose.model('Usuario', usuarioSchema);