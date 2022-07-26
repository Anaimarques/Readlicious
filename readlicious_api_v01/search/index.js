const sql = require('mssql');

module.exports = async function (context, req) {
    const config = {
        user: 'readlicious_admin',
        password: 'Delicious4ever',
        server: 'readlicious-db-server-v01.database.windows.net',
        database: 'readlicious_db_v01',
        port: 1433
    };


    
    var tipoSearch = req.query.tipo;
    //console.log("tipo: " +tipoSearch);
    var quer = req.query.q;
    //console.log("quer: " +quer);
    var queryS = "";

    if(tipoSearch == "utilizador"){
        queryS = "Select * from utilizadores where username like '%" + quer + "%' or nome_e_apelido like '%" + quer + "%' or email like '%" + quer + "%'";
    }else if(tipoSearch == "titulo"){
        //console.log("chegou aqui 1!");
        queryS = "Select * from livros where titulo like '%" + quer + "%'";
     }else if(tipoSearch == "isbn"){
        //console.log("chegou aqui 2!");
            queryS = "Select * from livros where isbn like '%" + quer + "%'";
     }else if(tipoSearch == "autor"){
        //console.log("chegou aqui 3!");
            queryS = "Select * from livros where isbn in (Select isbn from livros2autor where autor_id in (Select id_autor from autor where apelido like '%"+ quer +"%' or nome like '%" + quer + "%'))";
     }
    console.log(queryS);
    
    results = await queryDB(queryS)
        .catch(err => {
            console.log(err)
        });
    console.log(results);
    context.res = {
        //status: 200, /* Defaults to 200 */
        body: results
    };

    async function queryDB(queryString) {
        let rows = [];
        let pool = await sql.connect(config);
        let data = await pool.request()
            .query(queryString);
        for (let i = 0; i < data.rowsAffected; i++) {
            rows.push(data.recordset[i]);
        }
        pool.close;
        return rows;
    }//sync function invocation
}