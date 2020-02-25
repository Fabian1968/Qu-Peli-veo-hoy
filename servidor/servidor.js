//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
//guardamos en variable el require del archivo controlador.js
var controladorRef = require('./controladores/controlador');


var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/peliculas/recomendacion?', controladorRef.recomendarPelis); //recomendación
app.get('/peliculas', controladorRef.mostrarPeliculas); //todas las pelis / filtros
app.get('/generos', controladorRef.obtenerGeneros); // géneros
app.get('/peliculas/:id', controladorRef.infoPelicula); // info pelis por id


//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function() {
    console.log("Escuchando en el port " + puerto);
});