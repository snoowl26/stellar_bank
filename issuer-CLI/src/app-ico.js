'use strict'

const fs = require('fs')
const axios = require('axios')
const program = require('commander')
const colors = require('colors')

const StellarSdk = require('stellar-sdk')

program
  .option('-t, --token <token>', 'token name')
  .option('-a, --amount <amount>', 'Token amount to be minted')
  .parse(process.argv)

const createAcc = (name) => {
  const newAcc = StellarSdk.Keypair.random()
  const account = { username: `${name}${program.token}` }

  return new Promise((resolve, reject) => {
    axios.get(`https://friendbot.stellar.org?addr=${newAcc.publicKey()}`)
      .then((response) => {
        const { data, status } = response
        if (status !== 200) {
          return new Error(`Status code !== 200. response.body=${JSON.stringify(body)}`)
        }
    
        account.seed = newAcc.secret();
        account.publicKey = newAcc.publicKey();
        account.result = StellarSdk.xdr.TransactionResult.fromXDR(data.result_xdr, 'base64');
    
        fs.writeFileSync(`./_sponsor.json`, JSON.stringify(account, null, 2) , 'utf-8');
        resolve(account)
      })
      .catch((error) => {
        reject(error)
      })
  })
} 

console.log(`Creating ${program.token} asset`);

let sponsor 
if (fs.existsSync('./_sponsor.json')) {
  const rawData = fs.readFileSync('./_sponsor.json')
  const jsonData = JSON.parse(rawData)
  sponsor = Promise.resolve(jsonData)
}
else {
  console.log(`creating sponsor account`);
  sponsor = createAcc('sponsor')
}

sponsor
  .then((data) => {
    return axios.post(
      `http://localhost:3005/api/ico`,
      {token: program.token, amount: program.amount, sponsorSeed: data.seed}
    )
  })
  .then((data) => {
    console.log(`Axios return: ${data}`);
  })
  .catch((error) => {
    console.log(`${error}`);
  })

