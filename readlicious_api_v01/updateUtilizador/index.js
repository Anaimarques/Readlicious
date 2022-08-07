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

    var response = '';
    var status = 200;

    results = await queryDB(insert_query)
        .catch(err => {
            console.log(err)
            status += 3
            response = 'Não foi possivel actualizar as informações.'
        });


    
    context.res = {
        status: status, /* Defaults to 200 */
        body: response
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