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


// 글 쓰기 페이지
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


// post 라우트는 html의 form 태그에서 method로 결정되며, url 주소는 form 태그의 action 속성값으로 설정함
// 또한 post는 get과 같이 앞에서 보여지는 것이 아닌 정보를 처리한 후 리다이렉션으로 처리된 정보를 get시켜주는 역할을 함.
// 글 등록 시 정보 전송 및 리다이렉트되는 라우트
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


// XAMPP로 DB안키면 topic 자체를 정의할 수 없기 때문에 오류먹음
// 글 목록 불러오는 페이지                         // + 쿼리스트링(/topic?id=0)의 경우는 req의 query로 id 변수에 접근한다.
app.get(['/topic', '/topic/:id'], (req, res) => { // 시멘틱 url(/topic/0)의 경우, id에 접근하는 방법은 req의 params 객체로 id 변수에 접근한다.
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
        console.log(topic) // 객체의 리스트를 값으로 갖는 객체
        console.log(topic[0]) // 그 객체의 첫번째 객체
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


// 글 수정 페이지
app.get('/topic/:id/edit', (req,res) => {
  let id = req.params.id
  sql = 'SELECT * FROM topic WHERE id=?'
  conn.query(sql, [id], (err, topic, fields) => {   
    if(id){ // id가 없으면 수정을 못하니까 else에 오류문
      res.render('edit', {topics : topic, topic : topic[0]})
    } else {
      console.log("There is no ID")
      res.status(500).send("Internal Server Error")
    }
  })
})

// 글 삭제 페이지
app.get('/topic/:id/delete', (req, res) => {
  let sql = 'SELECT id, title FROM topic'
  let id = req.params.id
  conn.query(sql, (err, topics, fields) => {
    let sql = 'SELECT * FROM topic WHERE id=?'
    conn.query(sql, id, (err, topic) => {
      if(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
      } else {
        if(topic.length === 0){
          console.log('There is no record')
          res.status(500).send("Internal Server Error")
        } else {
          res.render('delete', {topics : topics, topic : topic[0]})
        }
      }
    })
  })
})


// 글 수정 시 정보 전송 및 리다이렉트 라우트
app.post('/topic/:id/edit', (req, res) => {
  let id = req.params.id
  let title = req.body.title
  let description = req.body.description
  let author = req.body.author

  let sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?' // sql에서 변수 ? 순서와

  conn.query(sql, [title,description,author,id], (err, result, fields) => { // 두번째 인자로 들어가는 배열의 변수 순서가 맞아야함. 틀리면 교체가 안됨
    if(err){
      console.log(err)
      res.status(500).send("Internal Server Error")
    }
    res.redirect('/topic/' + id)
  })
})

app.post('/topic/:id/delete', (req, res) => {
  let id = req.params.id

  let sql = 'DELETE FROM topic WHERE id=?'

  conn.query(sql, [id], (err, result, fields) => {
    if(err){
      console.log(err)
      res.status(500).send("Internal Server Error")
    }
    res.redirect('/topic')
  })
})