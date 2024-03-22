"use strict"

const StellarSDK = require('stellar-sdk')
const colors = require('colors')

const fundAccount = (name, sponsorSeed) => {
  return new Promise(async (resolve, reject) => {
    const newAcc = StellarSDK.Keypair.random();
    const sponsor = StellarSDK.Keypair.fromSecret(sponsorSeed)
    
    StellarSDK.Network.usepubnetwork();
    const server = new StellarSDK.Server('https://horizon-pubnet.stellar.org');
    
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
      startingBalance: '100',
    }))
    .setTimeout(1000)
    .build();
    
    tx.sign(sponsor);
    
    server.submitTransaction(tx)
      .then(() => {
        resolve({ name: name, seed: newAcc.secret(), pubk: newAcc.publicKey() })
      })
      .catch(error => {
        const msg = error.response.data.extras.result_codes.transaction
        console.log(error.response.data.extras.result_codes)
        reject(`StellarAPI2 erorr: ${msg}`) 
      })
  })
}

const allowTrustLineAuth = (token, investorPubk, issuerSeed, authorize) => {
  return new Promise((resolve, reject) => {
    const issuer = StellarSDK.Keypair.fromSecret(issuerSeed)
    
    StellarSDK.Network.useTestNetwork()
    const server = new StellarSDK.Server('https://horizon-testnet.stellar.org')
    
    server.loadAccount(issuer.publicKey())
      .then((issuerAcc) => {
        const tx = new StellarSDK.TransactionBuilder(issuerAcc, {fee: 100})
          .addOperation(StellarSDK.Operation.allowTrust({
            trustor: investorPubk,
            assetCode: token,
            authorize: authorize,
            source: issuer.publicKey()
          }))
          .setTimeout(1000)
          .build()
      
      tx.sign(issuer);
      return server.submitTransaction(tx)
    })
    .then((result) => {
      resolve('OK')
    })
    .catch((error) => {
      console.log(Object.entries(error.response.data.extras.result_codes));
      reject(new Error(error))
    });
  })
}

const changeTrustLineAuth = (token, trustSeekerSeed, issuerPubKey) => {
  return new Promise((resolve, reject) => {
    const trustSeeker = StellarSDK.Keypair.fromSecret(trustSeekerSeed)
    
    StellarSDK.Network.usepubnetwork()
    const server = new StellarSDK.Server('https://horizon-pubnet.stellar.org')
    
    server.loadAccount(trustSeeker.publicKey())
      .then((trustSeekerAcc) => {
        const tx = new StellarSDK.TransactionBuilder(trustSeekerAcc, {fee: 100})
          .addOperation(StellarSDK.Operation.changeTrust({
            asset: new StellarSDK.Asset(token, issuerPubKey),
            source: trustSeeker.publicKey()
          }))
          .setTimeout(1000)
          .build()
      
      tx.sign(trustSeeker);
      return server.submitTransaction(tx)
    })
    .then((result) => {
      resolve('OK')
    })
    .catch((error) => {
      console.log(error.response.data.extras.result_codes);
      reject(new Error(error))
    });
  })
}

const setAuthFlag = (issuerSeed) => {
  return new Promise((resolve, reject) => {
    const issuer = StellarSDK.Keypair.fromSecret(issuerSeed)
    
    StellarSDK.Network.useTestNetwork()
    const server = new StellarSDK.Server('https://horizon-testnet.stellar.org')
    
    server.loadAccount(issuer.publicKey())
      .then((issuerAcc) => {
        const tx = new StellarSDK.TransactionBuilder(issuerAcc, {fee: 100})
          .addOperation(StellarSDK.Operation.setOptions({
            setFlags: StellarSDK.AuthRequiredFlag | StellarSDK.AuthRevocableFlag
          }))
          .setTimeout(1000)
          .build();

        tx.sign(issuer);

        return server.submitTransaction(tx);
      })
      .then((result) => {
        resolve('OK')
      })
      .catch((error) => {
        console.log(error.response.data.extras.result_codes);
        reject(new Error(error));
      });
  })
}

module.exports = {
  fundAccount,
  allowTrustLineAuth,
  changeTrustLineAuth,
  setAuthFlag,
}
