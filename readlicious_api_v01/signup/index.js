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

    var username = body.signUp.username;
    var nome = body.signUp.nome;
    var apelido = body.signUp.apelido;
    var email = body.signUp.email;
    var empresa = body.signUp.empresa;
    var telefone = body.signUp.telefone;
    var nif = body.signUp.nif;
    var distrito = body.signUp.distrito;
    var pais = body.signUp.pais;
    var tipoSubscricao = body.signUp.tipo_subscricao;
    var n_bibliotecas = body.signUp.n_bibliotecas;
    var n_convites = body.signUp.n_convites;
    var foto_perfil = body.signUp.foto_perfil;
    var pass = body.signUp.pass;

    var response = '';

    // Verifying if the record already exists, first by username
    var result = await queryDB("Select * from utilizadores where username='" + username + "'")
        .catch(err => {
            console.log(err)
        });

    if (result.length > 0) {

        response = "O username '" + username + "' já existe.";

        context.res = {
            status: 213, /* Defaults to 200 */
            body: response
        };
    } else {
        // Verifying if the record already exists, by email
        result = await queryDB("Select * from utilizadores where email='" + email + "'")
            .catch(err => {
                console.log(err)
            });
        if (result.length > 0) {

            response = "O email '" + email + "' já existe.";

            context.res = {
                status: 213, /* Defaults to 200 */
                body: response
            };

        } else {
            //There is no record with the given information
            // Create the insert into utilizadores query
            var db_query = ("Insert into utilizadores (username, nome_e_apelido, email, empresa, telemovel, nif, distrito, pais, tipo_subscricao, n_bibliotecas, n_convites, foto_perfil)" +
                "values ('" + username + "','"
                + nome + " " + apelido + "','"
                + email + "','"
                + empresa + "','"
                + telefone + "','"
                + nif + "','"
                + distrito + "','"
                + pais + "','"
                + tipoSubscricao + "','"
                + n_bibliotecas + "','"
                + n_convites + "','"
                + foto_perfil + "')"
            );

            // Test the query string format
            //console.log(db_query);

            // User data insert
            var results = await queryDB(db_query)
                .catch(err => {
                    console.log(err)
                });

            // for get the user id for login data insertion
            var results2 = await queryDB("Select id_user from utilizadores where username='" + username + "'")
                .catch(err => {
                    console.log(err)
                });

            var salt = bcrypt.genSaltSync(saltRounds);
            var hash = bcrypt.hashSync(pass, salt);

            // Create the user login insert query
            var db_query2 = ("Insert into logInData (id_user, username, email, pass) " +
                "values ('" + results2[0].id_user + "','"
                + username + "','"
                + email + "','"
                + hash + "')"
            );

            // Insert user login data
            var results3 = await queryDB(db_query2)
                .catch(err => {
                    console.log(err)
                });

            //var hash = results[0].pass;

            // validate input password with hash from DB.
            //response = bcrypt.compareSync(inputPass, hash);
            //response = (inputPass == hash);

            response = results3;

            context.res = {
                status: 200, /* Defaults to 200 */
                body: response
            };
        }
    }

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