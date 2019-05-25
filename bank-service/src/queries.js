const dbQuery = require('./db')

const selectToken = (token) => {
  const sql = `SELECT * FROM tokens WHERE name=$1`
  const params = [token]
  return dbQuery(sql, params)
}

const insertBankAccount = (pubk, seed, name) => {
  const sql = `INSERT INTO bankaccounts(pubk, seed, name) VALUES($1, $2, $3)`
  const params = [pubk, seed, name]
  return dbQuery(sql, params)
}

const insertToken = (token, issuerSeed, distributorSeed, amount) => {
  const sql = `INSERT INTO tokens(name, issuer, distributor, amount) VALUES($1, $2, $3, $4)`
  const params = [token, issuerSeed, distributorSeed, amount]
  return dbQuery(sql, params)
}

module.exports = {
  selectToken,
  insertBankAccount,
  insertToken,
}

// const test = () => {
//   const p = "XXXXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB"
//   const s = "XXXX6USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7"
//   return writeAccount(p, s, "tomo")
// }

// const test3 = () => {
//   const p = "SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7"
//   const s = "GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB"
//   return insertToken('FUUUUN', p, s, 1000)
// }

// const test2 = () => {
//   console.log('dupa')
//   const sql = `SELECT * FROM investors`
//   const params = []
//   return dbQuery(sql, params)
// }


// test2()
//   .then((data) => {
//     console.log(data.rows);
//   })
//   .catch((err) => {
//     console.log(err)
//   })
// test2()