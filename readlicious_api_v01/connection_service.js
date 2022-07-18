const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
    authentication: {
        options: {
            userName: "readlicious_admin", // update me
            password: "Delicious4ever" // update me
        },
        type: "default"
    },
    server: "readlicious-db-server-v01.database.windows.net", // update me
    options: {
        database: "readlicious_db_v01", //update me
        encrypt: true
    }
};

function connectDatabase(){
    const connection = new Connection(config);
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Connection established.");
          queryDatabase();
        }
      });
      
    connection.connect();   
}
    
    


