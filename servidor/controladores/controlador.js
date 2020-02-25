//CONEXIÓN A LA BD
var con = require('../lib/conexionbd');


//FUNCIÓN PARA MOSTRAR PELÍCULAS CON Y SIN FLTROS
function mostrarPeliculas(req, res) {

    var titulo = req.query.titulo; //titulo peli
    var genero = req.query.genero; //género peli
    var anio = req.query.anio; //año de realización peli
    var columna_Orden = req.query.columna_orden; // columna por la que ordena el resultado
    var cantidad = req.query.cantidad; // cantidad de pelis por página
    var pagina = req.query.pagina; // número de página
    var tipo_Orden = req.query.tipo_orden; // orden asc o desc

    var limite = ((pagina - 1) * cantidad) + "," + cantidad; // para la cláusula LIMITE DE la query

    var sql = 'SELECT * FROM pelicula WHERE 1=1'; // query sin filtros
    var totalSelect = 'SELECT COUNT (*) as total FROM pelicula WHERE 1=1'; // query para total rows

    //filtro por título
    if (titulo) {
        sql += ' AND titulo LIKE ' + '"%' + titulo + '%"';
        totalSelect += ' AND titulo LIKE ' + '"%' + titulo + '%"';
    }

    //filtro por género
    if (genero) {
        sql += ' AND genero_id = ' + '"' + genero + '"';
        totalSelect += ' AND genero_id = ' + '"' + genero + '"';
    }

    //filtro por año de realización
    if (anio) {
        sql += ' AND anio = ' + '"' + anio + '"';
        totalSelect += ' AND anio = ' + '"' + anio + '"';
    }

    //ordenar por columna y por tipo de órden 
    if (columna_Orden) {
        sql += ' ORDER BY ' + columna_Orden + ' ' + tipo_Orden;
    }

    // limite para la paginación
    sql += ' LIMIT ' + limite;

    con.query(sql, (error, resultado, campos) => {
        if (error) {
            console.log("Hubo un error", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        };

        var response = {
            'peliculas': resultado,
            "total": "",

        };

        con.query(totalSelect, (error, resultadoTotal, fields) => {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            response.total = resultadoTotal[0].total;
            res.send(JSON.stringify(response));
        });
    });
};

//FUNCIÓN PARA OBTENER GÉNEROS
function obtenerGeneros(req, res) {
    const sql = "SELECT * FROM genero";
    con.query(sql, (error, resultado, campos) => {
        if (error) {
            console.log("Hubo un error", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        var response = {
            'generos': resultado
        }

        res.send(JSON.stringify(response));
    })

};

//FUNCIÓN PARA MOSTRAR INFO DE LA PELÍCULA SELECCIONADA
function infoPelicula(req, res) {
    var id = req.params.id;

    /*En la query se trae el campo nombre de la tabla género como género, porque sino
    se genera un conflicto con el campo nombre de la tabla actor. 
    En el frontend se hace genero = data.pelicula.genero en lugar de data.pelicula.nombre
    */

    const sql = "SELECT pelicula.*, actor.*, genero.nombre as genero FROM pelicula JOIN genero on genero.id = pelicula.genero_id JOIN actor_pelicula on pelicula.id = actor_pelicula.pelicula_id JOIN actor on actor.id = actor_pelicula.actor_id WHERE pelicula.id = " + id + "";


    con.query(sql, (error, resultado, campos) => {
        //|| typeof Number(id) !== "number" || isNaN(Number(id))
        if (error) {
            console.log("Hubo un error", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        var response = {
            'pelicula': resultado[0],
            'actores': resultado,
            'genero': resultado,
        }

        res.send(JSON.stringify(response));

    })
}

//FUNCIÓN PARA RECOMENDAR PELIS
function recomendarPelis(req, res) {

    var anio_inicio = req.query.anio_inicio;
    var anio_fin = req.query.anio_fin;
    var puntuacion = req.query.puntuacion;
    var genero = req.query.genero;



    var sql = 'SELECT pelicula.*, genero.nombre FROM pelicula JOIN genero ON pelicula.genero_id = genero.id WHERE 1=1 ';

    if (genero) {
        sql += ' AND nombre = "' + genero + '"';
    }

    if (anio_inicio) {
        sql += ' AND anio BETWEEN ' + anio_inicio + ' AND ' + anio_fin;
    }
    if (puntuacion) {
        sql += ' AND puntuacion = ' + puntuacion;
    }


    con.query(sql, (error, resultado, campos) => {
        if (error) {
            console.log("Hubo un error", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        var response = {
            'peliculas': resultado,
        }

        res.send(JSON.stringify(response));

    })

}





module.exports = {
    recomendarPelis: recomendarPelis,
    mostrarPeliculas: mostrarPeliculas,
    obtenerGeneros: obtenerGeneros,
    infoPelicula: infoPelicula

}