const sql = require('mssql');


module.exports = async function (context, req) {

    const config = {
        user: 'readlicious_admin',
        password: 'Delicious4ever',
        server: 'readlicious-db-server-v01.database.windows.net',
        database: 'readlicious_db_v01',
        port: 1433
    };

    var body = req.body;

    //console.log(JSON.parse(req.body));

    //var body = JSON.parse(req.body);

    var isbn = body.livroInfo.isbn;
    var titulo = body.livroInfo.titulo.toString();
    var editora = body.livroInfo.editora;
    var nr_edicao = body.livroInfo.nr_edicao;
    var ano_edicao = body.livroInfo.ano_edicao;
    var nr_paginas = body.livroInfo.nr_paginas;
    var idioma = body.livroInfo.idioma;
    var capa = body.livroInfo.capa;
    var id_genero = body.livroInfo.id_genero;
    var rating = body.livroInfo.rating;
    var notas = body.livroInfo.notas;
    var estado = body.livroInfo.estado;
    var preco = body.livroInfo.preco;

    //console.log(body.livroInfo);

    var response = '';
    var status = 200;

    var insert_query = "Insert into livros (isbn, titulo, editora, nr_edicao, ano_edicao, nr_paginas, idioma, capa, id_genero, rating, notas, estado, preco)"
        + "values ('"
        + isbn + "', '"
        + titulo + "', '"
        + editora + "', '"
        + nr_edicao + "', '"
        + ano_edicao + "', '"
        + nr_paginas + "', '"
        + idioma + "', '"
        + capa + "', '"
        + id_genero + "', '"
        + rating + "', '"
        + notas + "', '"
        + estado + "', '"
        + preco + "')";

    results = await queryDB(insert_query)
        .catch(err => {
            console.log(err)
            status += 3
        });

    var autor = body.livroInfo.autor;

    var autorArray = autor.trim().split(/\s+/)

    //console.log(autorArray[0] + autorArray[1]);
    //console.log(autorArray.length);

    var autorFirstNames = ""
    var autorLastName = autorArray[autorArray.length - 1];
    if (autorArray.length > 1) {
        for (let i = 0; i < autorArray.length - 1; i++) {
            if (i == autorArray.length - 2)
                autorFirstNames += autorArray[i];
            else
                autorFirstNames += autorArray[i] + " ";
        }
    }

    var searchAutor = "Select id_autor from autor where nome= '" + autorFirstNames + "' and apelido = '" + autorLastName + "'";

    //console.log("string select Autor: " + searchAutor);

    resultsSearchAutor = await queryDB(searchAutor)
        .catch(err => {
            console.log(err)
            status += 5
        });

    if (resultsSearchAutor.length != 0) {

        //console.log(resultsSearchAutor);

        var id_autor = resultsSearchAutor[0].id_autor

        //console.log(id_autor);


        var searchLivro = "SELECT TOP 1 id_livro FROM livros ORDER BY id_livro DESC";

        resultsSearchLivros = await queryDB(searchLivro)
            .catch(err => {
                console.log(err)
                status += 7
            });

        //console.log(resultsSearchLivros);

        var id_livro = resultsSearchLivros[0].id_livro; 

        /*  for(let i= 0; i<resultsSearchLivros.length; i++)
             console.log(resultsSearchLivros[i].id_livro); */

        var insert_livros2autor = "Insert into livros2autor (autor_id, livro_id) values ('" + id_autor + "', '" + id_livro + "')";

        /* if(resultsSearchLivros.length > 1){
            for(i = 0; i < resultsSearchLivros.length; i++){
                if (i == resultsSearchLivros.length - 1)
                    insert_livros2autor += "('" +id_autor + "', '" + resultsSearchLivros[i].id_livro + "')";
                else
                    insert_livros2autor += "('" +id_autor + "', '" + resultsSearchLivros[i].id_livro + "')" + ", ";
            }
        } else{
            insert_livros2autor += "('" +id_autor + "', '" + resultsSearchLivros[0].id_livro + "')";
        } */

        //console.log(insert_livros2autor);

        resultsLivros2Autor = await queryDB(insert_livros2autor)
            .catch(err => {
                console.log(err)
                status += 11
            }); 
        
        var id_biblioteca = body.livroInfo.id_biblioteca;
        let date_obj = new Date();
        let month = ("0" + (date_obj.getMonth() + 1)).slice(-2);
        let day = ("0" + date_obj.getDate()).slice(-2);
        let hours = ("0" + date_obj.getHours()).slice(-2);
        let minutes = ("0" + date_obj.getMinutes()).slice(-2);
        let seconds = ("0" + date_obj.getSeconds()).slice(-2);
        var date = "" + date_obj.getFullYear() + month + day + " " 
                      + hours + ":" + minutes + ":"  + seconds;

        //console.log(date);


        var insert_bibliotecas2livros = "Insert into bibliotecas2livros (biblioteca_id, livro_id, data_insercao)"
                                      + "values ('" + id_biblioteca + "', '" + id_livro + "', '" + date + "')";

        resultsbibliotecas2livros = await queryDB(insert_bibliotecas2livros)
            .catch(err => {
                console.log(err)
                status += 13
            }); 
    }

    context.res = {
        status: status, /* Defaults to 200 */
        body: results
    };

    async function queryDB(queryString) {
        let rows = [];
        let pool = await sql.connect(config);
        let data = await pool.request()
            .query(queryString);
        if (typeof data.recordset !== 'undefined') {
            for (let i = 0; i < data.rowsAffected; i++) {
                rows.push(data.recordset[i]);
                console.log("index, data: " + i + ", " + data.recordset[i]);
            }
        }
        pool.close;
        return rows;
    }//sync function invocation
}