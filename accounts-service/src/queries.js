const dbQuery = require('./db')

const getUserByEmail = (email) => {
  const sql = `SELECT * FROM accounts WHERE email=$1`
  const params = [email]
  return dbQuery(sql, params)
}

const getUserByEmailAndToken = (email, token) => {
  const sql = `SELECT * FROM accounts WHERE email=$1 AND token=$2`
  const params = [email, token]
  return dbQuery(sql, params)
};

const saveAccount = (email, token, pubk) => {
  const sql = `INSERT INTO accounts (email, token, frozen, investor_pubk)
               VALUES ($1, $2, false, $3)`;
  const params = [email, token, pubk];
  return dbQuery(sql, params);
};

const getInvestorSeed = (pubk) => {
  return new Promise(async (resolve, reject) => {
    const sql = `SELECT seed FROM investors WHERE pubk = $1 LIMIT 1`;
    const params = [pubk];
    const result = await dbQuery(sql, params);

    if (result.rowCount !== 1) {
      reject("Investor does not exist");
    } else {
      resolve(result.rows[0].seed);
    }
  });
};

const getIssuerPubk = (token) => {
  return new Promise(async (resolve, reject) => {
    const sql = `SELECT issuer FROM tokens WHERE name=$1 LIMIT 1`;
    const params = [token];
    const result = await dbQuery(sql, params);

    if (result.rowCount !== 1) {
      reject(`Issuer for token(${token}) does not exist`);
    } else {
      resolve(result.rows[0].issuer);
    }
  });
};

module.exports = {
  getUserByEmail,
  getUserByEmailAndToken,
  getInvestorSeed,
  getIssuerPubk,
  saveAccount
};