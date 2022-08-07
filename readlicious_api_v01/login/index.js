const sql = require('mssql');
const bcrypt = require('bcrypt');
const { json } = require('express');
const saltRounds = 10;



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

    var user_email = body.loginInput.user_email;
    var inputPass = body.loginInput.pass;
    
    //var salt = bcrypt.genSaltSync(saltRounds);
    //var hash = bcrypt.hashSync(myPlaintextPassword, salt);
    

    var db_query = ("Select pass from logInData where username = '"+ user_email + "' or email ='" + user_email + "'");
    
    //var db_query = ("Select pass from logInData where username = 'ben_cumberbatch' or email ='ben_cumberbatch'");
     
    // query the database
    results = await queryDB(db_query)
   .catch(err => {
       console.log(err)
    }); 
    
    hash = results[0].pass;
    
    // validate input password with hash from DB.
    response = bcrypt.compareSync(inputPass, hash);
    //response = (inputPass == hash);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: response
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