const queries = require('./queries');

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
}

module.exports = {
	validateInvestor
};
