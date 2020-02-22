const Sequelize = require('sequelize')
const connection = new Sequelize('perguntas','root','rato1994@', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection