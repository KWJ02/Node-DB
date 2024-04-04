const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.locals.pretty = true;
app.set('views', './views') // 템플릿 엔진들의 파일들을 저장할 경로 설정
app.set('view engine', 'jade') // jade라는 템플릿 엔진을 사용할 것을 express에게 알림

// app.use로 사용되는 모든 모듈은 요청이 라우팅되기 전에 먼저 통과됨.
app.use(express.static('public')) // public이라는 폴더 내부의 정적 파일들을 제공할 것이라는 코드
app.use(bodyParser.urlencoded({ extended: false }))
/* bodyParser라는 모듈이 use로 선행되지 않으면 post방식으로 전달된 객체들을
  req.body.객체명 으로 접근해야 하는데, body를 읽을 수가 없기 때문에 undefined 오류가 발생함 */

app.get('/', (req, res) => { // '/'는 home, home으로 접속 시 콜백함수가 실행
  res.send('<h1>홈페이지</h1>')
})

app.get('/topic', (req, res) => { // get 주소 '/topic'이 아니라 'topic'이라고만 치면 오류먹음
  var topics = [
    'Javascript is..',
    'Nodejs is...',
    'Express is...'
  ]
  var output = `
  <a href="/topic?id=0">Javascript</a><br>
  <a href="/topic?id=1">Nodejs</a><br>
  <a href="/topic?id=2">Express</a><br><br>
  ${topics[req.query.id]}
  `
  // req.query."id"이면 url 상에서 /topic?"id"=0 처럼 통일해야 함.
  res.send(output)
})



app.get('/topic/:id', (req, res)=>{ // /topic/:id <- 처럼 ':변수' 가 붙으면 url상에 쿼리스트링(/topic?변수=값) 형식으로 접근해도 되고, (/topic/값) 형식으로 접근해도 됨.  
  var topics = [
    'Javascript is..',
    'Nodejs is...',
    'Express is...'
  ]
  var output = `
  <a href="/topic/0">Javascript</a><br>
  <a href="/topic/1">Nodejs</a><br>
  <a href="/topic/2">Express</a><br><br>
  ${topics[req.params.id]}
  ` // 라우트에 :변수가 붙을때는 쿼리스트링이 아니기 때문에, req의 params객체를 이용해서 변수에 접근하고, 쿼리스트링의 경우 req의 query 객체를 이용해서 변수에 접근한다.
  res.send(output)
})



// app.get('/topic', (req, res)=>{
//   var topics = [
//     'Javascript is..',
//     'Nodejs is...',
//     'Express is...'
//   ]
//   var output = `
//   <a href="/topic?id=0">Javascript</a><br>
//   <a href="/topic?id=1">Nodejs</a><br>
//   <a href="/topic?id=2">Express</a><br><br>
//   ${topics[req.query.id]}
//   `
//   res.send(output)
// })

app.get('/topic/:id/:mode', (req, res) => {
  res.send(req.params.id + ',' + req.params.mode)
})

app.get('/templete', (req, res) => {
  res.render('temp', {time : Date(), _title : 'Jade'}) // templete 경로로 들어온 사용자들에게 temp파일을 렌더링해서 응답해주겠다는 코드
})

app.get('/dynamic', (req, res) => {
  let lis = ''
  for(i = 0; i < 5; i++){
    lis += "<li>coding</li>"
  }
  res.send(`
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
      Hello Dynamic!
      <ul>
        ${lis}
      </ul>
    </body>
  </html>
  `)
})

app.get('/route', (req, res) => {
  res.send('Hello Route <img src="/cat.jpg">')
})

app.get('/login', (rep,res) => {
  res.send('로그인 페이지입니다.')
})

app.get('/form', (req, res) => { // get 방식은 url에 쿼리스트링을 붙임으로써 정보를 전달하는 방식
  let title = req.query.title    // req의 query 객체를 이용해서 사용자가 넘긴 정보에 접근함
  let description = req.query.description
  res.render('temp')
})

app.post('/form_receiver', (req, res) => { // post 방식은 쿼리스트링을 사용하지 않아 url에 쿼리스트링이 따로 붙지 않음
  let title = req.body.title               // req의 body 객체를 이용해서 사용자가 넘긴 정보에 접근함, post 방식에서 req의 body객체는 원래 존재하지 않지만, bodyParser 모듈을 이용하여 req.body의 객체를 생성해 읽을 수 있게 만드는 것
  let description = req.body.description
  res.send(title + ',' + description)
})

app.get('/form_receiver', (req, res) => {
  res.send(req.query.id + ',' + req.query.password)
})

app.listen(3000, () => {
  console.log('Connected at 3000 port!')
});