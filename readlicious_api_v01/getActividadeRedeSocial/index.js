const sql = require('mssql');

module.exports = async function (context, req) {
    const config = {
        user: 'readlicious_admin',
        password: 'Delicious4ever',
        server: 'readlicious-db-server-v01.database.windows.net',
        database: 'readlicious_db_v01',
        port: 1433
    };

    var id = context.bindingData.id;

    results = await queryDB("Select * from actividade_rede_social where id_actividade=" + id )
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