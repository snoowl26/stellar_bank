const queries = require('./queries');
const stellarUtils = require('../../stellar_utils');
const colors = require('colors');
const axios = require('axios');

const validateInvestor = (email, token) => {
	return new Promise(async (resolve, reject) => {
		const result = await queries.getUserByEmailAndToken(email, token);

		if (!result) {
			return reject(new Error("[VALIDATE_INVESTOR] Database error"));
		}

		if (result.rowCount !== 0) {
			resolve({status: 201, data: {}, message: "Investor exists"});
		} else {
			resolve({status: 200, data: result, message: "Investor does not exist"});
		}
	});
};

function register(email, token, pubk) {
	return new Promise(async (resolve, reject) => {
		const validateUserRes = await handleValidate(email);
		if (validateUserRes.status === 200) {
			const validateTokenRes = await handleValidateToken(token);
			if (validateTokenRes.status === 200) {
				const investorSeed = await queries.getInvestorSeed(pubk);
				const issuerPubk = await queries.getIssuerPubk(token);
				return stellarUtils.createTrustLine(token, investorSeed, issuerPubk)
					.then(async (result) => {
            await queries.saveAccount(email, token, pubk);
            console.log(`SUCCESS. ${token} ${email} : Register`.green);
						resolve(result);
					}).catch((error) => {
            console.log(`FAIL. ${token} ${email} : Register`.red);
						reject(error.message);
				});
			}
		}
		reject("Register with token failed")
	});
}

function handleValidate(email) {
	return axios.post(`http://localhost:3002/api/validate`, {email})
		.then((response) => {
			let message = '';
			if (response.status !== 200) {
				message = `[VALIDATE_USER] Something went wrong. Response ${response}`;
			}
			return {status: response.status, data: response, message: message};
		}).catch((error) => {
      console.log(`FAIL ${email}: user validation`.red);
			return {status: 500, data: {}, message: `[VALIDATE_USER] Something went wrong: ${error.message}`};
		});
}

function handleValidateToken(token) {
	return axios.post(`http://localhost:3003/api/validate_token`, {token})
		.then((response) => {
			let message = '';
			if (response.status !== 200) {
				message = `[VALIDATE_TOKEN] Something went wrong. Response ${response}`;
			}
			return {status: response.status, data: response, message: message};
		}).catch((error) => {
      console.log(`FAIL ${token}: token validation`.red);
			return {status: 500, data: {}, message: `[VALIDATE_TOKEN] Something went wrong: ${error.message}`};
	});
}

module.exports = {
	validateInvestor,
  register
};
