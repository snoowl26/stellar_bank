const express = require('express')
const axios = require('axios')
const queries = require('./queries') 
const utils = require('./utils')
const StellarSDK = require('stellar-sdk')
const api = express.Router()

api.post('/register', async (req, res) => {
  const {token, email, publicKey} = req.body;
  const result = await utils.validateInvestor(email, token)
		.catch((error) => {
			return {status: 500, message: error.message};
		});

	if (result.status !== 200) {
		return res.status(result.status).send(result.message);
	}

	if (token) {
		const validateUserRes = axios.post(`http://localhost:3002/api/validate`, {email})
			.then((response) => {
				if (response.status !== 200) {
					console.log(`[VALIDATE_USER] Something went wrong. Response ${response}`);
				}
				return response.status;
			}).catch((error) => {
				console.log(`[VALIDATE_USER] Something went wrong: ${error.message}`);
				return 500;
			});

		const validateTokenRes = axios.post(`http://localhost:3003/api/validate_token`, {token})
			.then((response) => {
				if (response.status !== 200) {
					console.log(`[VALIDATE_USER] Something went wrong. Response ${response}`);
				}
				return response.status;
			}).catch((error) => {
				console.log(`[VALIDATE_TOKEN] Something went wrong: ${error.message}`);
				return 500;
			});

		if (await validateUserRes === 200 && await validateTokenRes === 200) {
			return res.status(201).send("Creating account...");
		}
		return res.status(200).send("Created account.");
	} else {
		registerWithoutToken(email);
	}
});

function registerWithoutToken(email) {
	axios.post(`http://localhost:3002/api/validate`, {email})
		.then((response) => {
			if (response.status !== 200) {
				console.log(`[VALIDATE_USER] Something went wrong. Response ${response}`);
				return response;
			}
			const keyPair = StellarSDK.Keypair.random();
      utils.createAccount(keyPair.publicKey())
        .then((body) => {
					console.log(`Account name      : ${email}`)
					console.log(`Seed (secret key) : ${keyPair.secret()}`)
					console.log(`Public key        : ${keyPair.publicKey()}`)
					console.log(`Transaction hash  : ${body.hash}`)
					console.log(`Transaction ledger: ${body.ledger}`);
				});
		}).catch((error) => {
			console.log(`[VALIDATE_USER] Something went wrong: ${error.message}`);
			return 500;
		});
}

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