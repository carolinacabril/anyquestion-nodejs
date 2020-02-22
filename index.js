const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

//Database Conexão
connection
    .authenticate()
    .then(() => {
        console.log('conexão feita com banco de dados')
    })
    .catch((error) => {
        console.error('Erro ao conectar-se no banco de dados!', error)
    })

//lincando body=parser no express e permintindo a conversão para estrutura JS
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Dizendo para o express usar EJS como template engine
app.set('view engine', 'ejs')

//Dizando para o express usar arquivos estáticos
app.use(express.static('public'))

//Rotas
app.get('/', (req, res) => {
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas => {
        res.render('index', {
            perguntas: perguntas
        })
    })  
})

app.get('/perguntar', (req,res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta', (req, res) => {
    let titulo = req.body.titulo  
    let descricao = req.body.descricao
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req, res) => {
    let id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id}
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        }else{
            res.redirect('/')
        }
    })
})

app.post('/responder', (req,res) => {
    let corpo = req.body.corpo
    let idPergunta = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: idPergunta
    }).then(() => {
        res.redirect("/pergunta/"+idPergunta)
    })
})

app.listen(3000, () => console.log('App Rodando!'))