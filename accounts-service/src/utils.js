const queries = require('./queries')

async function validateInvestor(email, token) {
	const result = await queries.getUserByEmailAndToken(email, token);

	if (!result) {
		return 0;
	}

	if (result.rowCount !== 0) {
		return 1;
	}

	return 2;
}

module.exports = {
	validateInvestor
};
