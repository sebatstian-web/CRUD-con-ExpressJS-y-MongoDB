const express = require('express');
const app = express();

const Usuario = require('../models/usuario.model');

app.get('/usuario', (req, res) => {
  const limite = req.query.limite || 0;
  const desde = req.query.desde || 0;

  Usuario
    .find({ estado: true })
    .limit(Number(limite))
    .skip(Number(desde))
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al obtener los usuarios',
          error: err
        });
      }

      Usuario.countDocuments({ estado: true }, (err, total) => {
        res.json({
          ok: true,
          total_registros: total,
          usuarios
        });
      });
    });
});

app.post('/usuario', (req, res) => {
  const body = req.body;
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email
  });

  usuario.save((err, usuario) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear nuevo usuario',
        error: err
      });
    }

    res.json({
      ok: true,
      mensaje: 'Nuevo usuario creado',
      usuario
    });
  });
});

app.put('/usuario/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;

  // Evita modificar el estado, se maneja solo a traves del delete
  delete body.estado;

  Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuario) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al modificar usuario',
        error: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        error: {
          mensaje: `No existe el usuario con ID: ${id}`,
        }
      });
    }

    res.json({
      ok: true,
      mensaje: 'El usuario fue modificado correctamente',
      usuario
    });
  });
});

app.delete('/usuario/:id', (req, res) => {
  const id = req.params.id;

  // Eliminando fisicamente el registro
  // Usuario.findByIdAndRemove(id, (err, usuario) => {

  // Cambiando el estado a false, para no borrar fisicamente
  Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuario) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al eliminar usuario',
        error: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        error: {
          mensaje: `No existe el usuario con ID: ${id}`,
        }
      });
    }

    res.json({
      ok: true,
      mensaje: 'El usuario fue eliminado correctamente',
      usuario
    });
  });
});

module.exports = app;