"use strict"

const StellarSDK = require('stellar-sdk')

const handleStellarCall = async (f, ...args) => {
  let result
  try {
    result = await f(...args)
  }
  catch (e) {
    console.log(`StellarAPI erorr: ${e}`)
  }
  return result
}

const fundAccount = (name, sponsorSeed) => {
  return new Promise(async (resolve, reject) => {
    const newAcc = StellarSDK.Keypair.random();
    const sponsor = StellarSDK.Keypair.fromSecret(sponsorSeed)
    
    StellarSDK.Network.useTestNetwork();
    const server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
    
    // TODO: handle errors
    const sponsorAccount = await server.loadAccount(sponsor.publicKey())
      // .then((result) => {
      //   sponsorAccount = result
      // })
      // .catch((error) => {
      //   const msg = error.response.data.extras.result_codes.transaction
      //   reject(`StellarAPI erorr: ${e.response.data.extras.result_codes}`)
      // })
    
    const tx = new StellarSDK.TransactionBuilder(sponsorAccount, {fee: 100})
    .addOperation(StellarSDK.Operation.createAccount({
      destination: newAcc.publicKey(),
      startingBalance: '1000' // TODO: hardcoded
    }))
    .addMemo(StellarSDK.Memo.text(`Creating ${name} acc`))
    .setTimeout(1000)
    .build();
    
    tx.sign(sponsor);
    
    
    server.submitTransaction(tx)
      .then(() => {
        resolve({ name: name, seed: newAcc.secret(), pubk: newAcc.publicKey() })
      })
      .catch(error => {
        const msg = error.response.data.extras.result_codes.transaction
        reject(`StellarAPI2 erorr: ${msg}`) 
      })
  })
}

const createTrustLine = (token, distributorSeed, issuerPubk) => {
  return new Promise((resolve, reject) => {
    const distributor = StellarSDK.Keypair.fromSecret(distributorSeed)

    StellarSDK.Network.useTestNetwork()
    const server = new StellarSDK.Server('https://horizon-testnet.stellar.org')
    
    server.loadAccount(distributor.publicKey())
      .then((distributorAcc) => {
        const tx = new StellarSDK.TransactionBuilder(distributorAcc, {fee: 100})
          .addOperation(StellarSDK.Operation.changeTrust({
            asset: new StellarSDK.Asset(token, issuerPubk),
            source: distributor.publicKey()
          }))
          // .addMemo(StellarSDK.Memo.text(`${token} trusline: Distributor -> issuer`))
          .setTimeout(1000)
          .build()
        
        tx.sign(distributor)
        resolve(server.submitTransaction(tx))
      })
      .then((result) => {
        console.log(`SUCCESS. ${token} trusline: Distributor -> issuer`.green)
        resolve()
      })
      .catch((error) => {
        console.error(`${error}`.red)
        reject(new Error(error))
      });
  })
}

const authorizeTrustLine = (token, distributorPubk, issuerSeed) => {
  const issuer = StellarSDK.Keypair.fromSecret(issuerSeed)
  StellarSDK.Network.useTestNetwork()
  const server = new StellarSDK.Server('https://horizon-testnet.stellar.org')

  server.loadAccount(issuer.publicKey())
    .then((issuerAcc) => {
      const tx = new StellarSdk.TransactionBuilder(issuerAcc, {fee: 100})
        .addOperation(StellarSDK.Operation.allowTrust({
          trustor: distributorPubk,
          assetCode: token,
          authorize: true,
          source: issuer.publicKey()
        }))
        // .addMemo(StellarSDK.Memo.text(`${token} trusline: Issuer -> Distributor`))
        .setTimeout(1000)
        .build()

      tx.sign(issuer)
      return server.submitTransaction(tx)
  })
  .then((result) => {
    console.log(`SUCCESS. ${token} trusline: Issuer -> Distributor`.green)
    console.log(result)
    resolve()
  })
  .catch((error) => {
    console.error(`${error}!`.red)
    reject(new Error(error))
  });
}

module.exports = {
  fundAccount,
  createTrustLine,
  authorizeTrustLine
}