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
    var status = 200;

    //Info para criação de Biblioteca
    var user_id = body.biblioInfo.user_id;
    var nome_biblioteca = body.biblioInfo.nome_biblioteca;
    var genero_id = body.biblioInfo.genero_id;
    var descricao = body.biblioInfo.descricao;
    var valor_biblioteca = 0;
    var data_criacao;

    let date_obj = new Date();
    let month = ("0" + (date_obj.getMonth() + 1)).slice(-2);
    let day = ("0" + date_obj.getDate()).slice(-2);
    let hours = ("0" + date_obj.getHours()).slice(-2);
    let minutes = ("0" + date_obj.getMinutes()).slice(-2);
    let seconds = ("0" + date_obj.getSeconds()).slice(-2);
    
    data_criacao = "" + date_obj.getFullYear() + month + day + " " 
                  + hours + ":" + minutes + ":"  + seconds;


    var insert_query = "Insert into biblioteca_pessoal (user_id, nome_biblioteca, genero_id, descricao, data_criacao, valor_biblioteca)"
        + "values ('"
        + user_id + "', '"
        + nome_biblioteca + "', '"
        + genero_id + "', '"
        + descricao + "', '"
        + data_criacao + "', '"
        + valor_biblioteca + "')";

    results = await queryDB(insert_query) 
        .catch(err => {
            console.log(err)
            status += 3
        });

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