const { Pool, Client } = require('pg')

const config = require('./config')

const pool = new Pool({
    user: config.DB_user,
    host: config.DB_hostname,
    database: config.DB_database,
    port: config.DB_port,
    password: config.DB_password
})

const dbQuery = (query, params, callback) => { 
  return pool.query(query, params, callback)
}

module.exports = dbQuery
