var mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "db"
});

con.connect((err) => {
    if (err) {
        console.error("Connection failed:", err.message);
    } else {
        console.log("Connected to the database.");
    }
});

module.exports=con;
