const mysql = require('mysql')
const conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'o2'
});

conn.connect();

/*
let sel = 'SELECT * FROM topic';
// rows에는 conn에 연결된 db, 즉 o2에 존재하는 테이블들의 row(행)가 출력됨
conn.query(sel, (err, rows, fields) => {
  if(err){
    throw err
  }
  for(let i = 0; i < rows.length; i++){
    console.log(rows[i].author)
  }
})
*/

/*
let ins = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)'
let params = ['Supervisor', 'Watcher', 'graphittie'] //  SQL Injection 막을 수 있는 방법
conn.query(ins, params, (err, rows, fields) => {
  // sql의 VALUES의 인수를 모두 ?로 바꾸고, 배열 params로 conn의 query 함수의 두번째 인수로 넣으면 VALUES의 ?에 대응됨
  if(err){
    console.log(err)
  } else {
    console.log(rows.fieldCount)
  }
})
*/

/*
// UPDATE와 DELETE는 WHERE 필수 !!
let up = 'UPDATE topic SET title=?, author=? WHERE id=?'
let params = ['JAVASCRIPT', 'eich', 1] //  SQL Injection 막을 수 있는 방법
conn.query(up, params, (err, rows, fields) => {
  // sql의 VALUES의 인수를 모두 ?로 바꾸고, 배열 params로 conn의 query 함수의 두번째 인수로 넣으면 VALUES의 ?에 대응됨
  if(err){
    console.log(err)
  } else {
    console.log(rows)
  }
})
*/

// UPDATE와 DELETE는 WHERE 필수 !!
let del = 'DELETE FROM topic WHERE id=?'
let params = [1] //  배열을 이용하여 ?에 집어넣는 방식이 SQL Injection 막을 수 있는 방법
conn.query(del, params, (err, rows, fields) => {
  // sql의 VALUES의 인수를 모두 ?로 바꾸고, 배열 params로 conn의 query 함수의 두번째 인수로 넣으면 VALUES의 ?에 대응됨
  if(err){
    console.log(err)
  } else {
    console.log(rows)
  }
})
conn.end();