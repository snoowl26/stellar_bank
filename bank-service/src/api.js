const express = require('express')
const axios = require('axios')

const stellarUtils = require('../../stellar_utils')
const queries = require('./queries') 

const api = express.Router()

api.post('/ico', async (req, res) => {
  console.log(`ICO KURWA`)
  const {token, sponsorSeed, amount} = req.body;

  const result = await queries.selectToken(token)

  if (!result) {
    console.log('error DB')
    return res.status(500).send('DB error')
  }

  if (result.rows.length !== 0) {
    console.log(`Token ${token} exists`);
    return res.status(201).send(`Token ${token} exists`)
  }

  // create issuer
  let issuer
  try {
    issuer = await stellarUtils.fundAccount(`issuer${token}`, sponsorSeed)
  }
  catch (error) {
    console.log(`Error creating issuer: ${error}`);
    return res.status(501).send(error)
  }

  // create distributor
  let distributor
  try {
    distributor = await stellarUtils.fundAccount(`distributor${token}`, sponsorSeed)
  }
  catch (error) {
    console.log(`Error creating distributor: ${error}`);
    return res.status(501).send(error)
  }

  // create trust line: distributor -> issuer
  try {
    await stellarUtils.createTrustLine(token, distributor.seed, issuer.pubk)
  }
  catch (error) {
    console.log(`Error creating trusline: ${error}`)
    return res.status(501).send(error)
  }

  // authorize trust line: issuer -> distributor
  try {
     await stellarUtils.authorizeTrustLine(token, distributor.pubk, issuer.seed)
  }
  catch (error) {
    console.log(`Error authorizing trusline: ${error}`)
    return res.status(501).send(error)
  }

  // insert issuer
  try {
    await queries.insertBankAccount(issuer.pubk, issuer.seed, issuer.name)
  }
  catch (error) {
    console.log(`Error inserting account: ${error}`);
    return res.status(501).send(error)
  }

  // insert distributor
  try {
    await queries.insertBankAccount(distributor.pubk, distributor.seed, distributor.name)
  }
  catch (error) {
    console.log(`Error inserting account: ${error}`);
    return res.status(501).send(error)
  }

  // insert token
  try {
    await queries.insertToken(token, issuer.pubk, distributor.pubk, amount)
  }
  catch (error) {
    console.log(`Error inserting token: ${error}`);
    return res.status(501).send(error)
  }

  res.status(200).send(`Token ${token} created`)
})

// TODO:
api.post('/balance', async (req, res) => {
  res.status(501).send('Not implemented function: balance')
})

// TODO:
api.post('/validate_token', async (req, res) => {
  const {token} = req.body;
  const result = await queries.selectToken(token)

  if (!result) {
    console.log('error DB')
    return res.status(500).send('DB error')
  }

  if (result.rows.length === 0) {
    console.log('Token not found');
    return res.status(201).send('Token not found')
  }

  console.log('200 sending row');
  return res.status(200).send('OK')
})

// TODO:
api.post('/validate_tx', async (req, res) => {
  res.status(501).send('Not implemented function: freeze')
})

// TODO:
api.post('/validate_issuer', async (req, res) => {
  res.status(501).send('Not implemented function: unfreeze')
})


module.exports = api