// Configuraciones globales
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexion con Mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/test-node', (err, res) => {
	if (err) throw err;
	console.log(`Conexión a MongoDB: ${res.name}`);
});

// Middlewares
app.use(require('./routes/usuario.route'));

// Levantando el servidor
app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto: ${process.env.PORT}`));