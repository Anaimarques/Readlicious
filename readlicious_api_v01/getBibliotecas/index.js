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
    var status = 200;
    results = await queryDB("Select * from biblioteca_pessoal where user_id=" + id)
        .catch(err => {
            console.log(err)
            status += 3
        });
    console.log(results);
    context.res = {
        status: status, /* Defaults to 200 */
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