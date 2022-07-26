const sql = require('mssql');

module.exports = function () {
    const config = {
        user: 'readlicious_admin',
        password: 'Delicious4ever',
        server: 'readlicious-db-server-v01.database.windows.net',
        database: 'readlicious_db_v01',
        port: 1433
    };

    
    this.queryDB = async function(queryString) {
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