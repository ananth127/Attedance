const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'sql110.infinityfree.com',
    user: 'if0_37146031',
    password: 'hQXd17kGUEb ',
    database: 'if0_37146031_vsb_it_data'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
