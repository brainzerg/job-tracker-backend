const mysql = require('mysql')

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
}


class Database {
  constructor(config) {
    this.config = config
  }

  init() {
    this.pool = mysql.createPool(this.config)
  }

  query(sql, values) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }
}

const db = new Database(config)

module.exports = { db }