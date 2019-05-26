const queries = require('./queries');
const stellarUtils = require('../../stellar_utils');
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

function registerWithoutToken(email) {
	return new Promise(async (resolve, reject) => {
		const result = await handleValidate(email);
		if (result.status !== 200) {
			reject(result);
		}
		resolve(await stellarUtils.createAccount(email));
	});
}

function registerWithToken(email, token) {
	return new Promise(async (resolve, reject) => {
		const validateUserRes = await handleValidate(email);
		if (validateUserRes.status === 200) {
			const validateTokenRes = await handleValidateToken(token);
			if (validateTokenRes.status === 200) {
				resolve("Creating account...");
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
			return {status: 500, data: {}, message: `[VALIDATE_TOKEN] Something went wrong: ${error.message}`};
	});
}

module.exports = {
	validateInvestor,
	registerWithoutToken,
	registerWithToken
};
