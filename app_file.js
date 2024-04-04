const express = require('express')
const app = express()
const fs = require('fs')

app.locals.pretty = true

app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.set('view engine', 'jade')
app.set('views', 'views_file')

app.listen(3000, () => {
  console.log('Server is connected at 3000 port')
})

app.get('/topic/new', (req, res) => {
  fs.readdir('./data', (err, data) => {
    if(err){
      console.log(err)
      res.status(500).send("Internal Server Error")
    }
    res.render('new', {topics : data})
  })
})
                                                  // + 쿼리스트링의 경우는 req의 query로 접근한다.
app.get(['/topic', '/topic/:id'], (req, res) => { // 시멘틱 url, id에 접근하는 방법은 req의 params 객체로 접근한다.
  let id = req.params.id
  if(id){
    fs.readFile('data/' + id, 'utf-8', (err, data) => { // fs의 readFile로 파일을 읽어올때, 두번째 옵션인수인 utf-8없이 데이터를 불러오면, 파일을 utf-8 형식으로 
      if(err){                                          // 인코딩해주는 것이 아니기 때문에, 페이지에 바로 나오지 않고 파일이 다운로드되는 형식으로 읽힘.
        console.log(err)
        res.status(500).send('Internal Server Error')
      }
      res.render('view', {title : id, topics : topics, description : data})
    })
    let topics = fs.readdirSync('data')
  }
  else {
    fs.readdir('./data', (err, data) => {
      if(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
      }
      res.render('view', {topics : data, title : 'Welcome', description : 'Server with Expressjs'})
    })
  }
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