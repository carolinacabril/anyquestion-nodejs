const Sequelize = require('sequelize')
const connection = new Sequelize('dbName','user','password', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection
