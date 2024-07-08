//mysql 모듈 소환
const mariadb = require('mysql2');

//DB와 연결 통로 생성
const connection = mariadb.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'root',
    database : 'NoteApp',
    dataStrings : true
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = connection;