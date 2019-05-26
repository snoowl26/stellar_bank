const express = require('express');
const axios = require('axios');
const queries = require('./queries');
const utils = require('./utils');
const api = express.Router();

api.post('/register', async (req, res) => {
  const {token, email, publicKey} = req.body;
  const result = await utils.validateInvestor(email, token)
		.catch((error) => {
			return {status: 500, message: error.message};
		});

	if (result.status !== 200) {
		return res.status(result.status).send(result.message);
	}

	// Add error handling
	if (token) {
		return res.status(200).send(await utils.registerWithToken(email, token));
	} else {
		return res.status(200).send(await utils.registerWithoutToken(email));
	}
});

api.post('/validate_investor', async (req, res) => {
  const {token, email, publicKey} = req.body;
  const result = await utils.validateInvestor(email, token);
  if (result === 0) {
    return res.status(500).send('DB error')
  }
  if (result === 1) {
    return res.status(201).send('Account already registered to that token')
  }

  return res.status(200).send('Account not yet registered')
});

// TODO:
api.post('/balances', (req, res) => {
  res.status(501).send('Not implemented function: balances')
  // check if email exists
  // => => => query balances
})

// TODO:
api.post('/balance', (req, res) => {
  res.status(501).send('Not implemented function: balance')
  // check if email exists
  // => => => query balance of a token
})

// TODO:
api.post('/freeze', (req, res) => {
  res.status(501).send('Not implemented function: freeze')
})

// TODO:
api.post('/unfreeze', (req, res) => {
  res.status(501).send('Not implemented function: unfreeze')
})

module.exports = api