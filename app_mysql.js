const express = require('express')
const app = express()
const fs = require('fs')
const mysql = require('mysql')
const conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'o2'
});

app.locals.pretty = true

app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.set('view engine', 'jade')
app.set('views', 'views_mysql')

app.listen(3000, () => {
  console.log('Server is connected at 3000 port')
})

app.get('/topic/add', (req, res) => {
  let sql = 'SELECT id, title FROM topic'
  conn.query(sql, (err, topics, fields) => {
    if(err){
      console.log(err)
      res.status(500).send("Internal Server Error")
    }
    res.render('add', {topics : topics})
  })
})

app.post('/topic/add', (req,res) => {
  let title = req.body.title
  let description = req.body.description
  let author = req.body.author

  let sql = 'INSERT INTO topic (title, description, author) VALUES(?,?,?)'
  let params = [title, description, author]

  conn.query(sql, params, (err, rows, fields) => {
    if(err){
      console.log(err)
      res.status(500).send("Internal Server Error")
    }
    res.redirect('/topic/' + rows.insertId)
  })
})
                                                  // + 쿼리스트링의 경우는 req의 query로 접근한다.
app.get(['/topic', '/topic/:id'], (req, res) => { // 시멘틱 url, id에 접근하는 방법은 req의 params 객체로 접근한다.
  let sql = 'SELECT id, title FROM topic'
  conn.query(sql, (err, topics, fields) => {
    if(err){
      console.log(err)
    }
    let id = req.params.id
    if(id) {
      var sql = 'SELECT * FROM topic WHERE id=?'
      conn.query(sql, [id], (err, topic, fields) => {   
        if(err){
          console.log(err)
          res.status(500).send("Internal Server Error")
        }
        console.log(topic)
        console.log(topic[0])
        /* 
        여기서 topic은 데이터베이스 상의 topic이라는 테이블에서 id가 ?인 하나의 row를 가져온 객체임.
        다른 말로 전체 row를 감싸는 객체 안에 RowDataPacket이라는 객체(id가 ?인 row)가 존재하는 형식(= 객체 안의 객체)
        그래서 jade로 넘길 때 topic : topic 처럼 넘기면 RowDataPacket 객체 자체가 넘어가기 때문에 접근 못하고,
        topic : topic[0] (어차피 RowDataPacket 객체 안엔 WHERE id=? 때문에 객체가 한개밖에없음.)
        로 접근해야 RowDataPacket 객체 안으로 접근할 수 있기에 row의 column 값인 title, description, author에 접근 가능한 것.
        */
        res.render('view', {topics : topic, topic : topic[0]})
      })
    } else {
      res.render('view', {topics : topics})
    }
  })
})

app.post('/topic', (req, res) => {
  let title = req.body.title
  let description = req.body.description

  fs.writeFile('data/' + title, description, (err) => { // writeFile의 첫 인수는 파일이 작성될 상대경로 적는 곳
    if(err){
      console.log(err)
      res.status(500).send("Internal Server Error")
    }
    res.redirect('/topic')
  })
})