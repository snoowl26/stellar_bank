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

function createAccount(pubkey) {
	console.log("DEBUG: pubk:" + pubkey);
	return new Promise((resolve, reject) => {
		request.get(
			{url: 'https://friendbot.stellar.org', qs: { addr: pubkey }, json: true},
			(error, response, body) => {
				if (error) {
					return reject(new Error('error=' + error.message));
				} else if (response.statusCode !== 200) {
					const msg = `response.statusCode=${response.statusCode}
          response.body='${JSON.stringify(response.body)}`;
					return reject(new Error(msg));
				}
				else {
					resolve(body)
				}
			});
	});
}

module.exports = {
	validateInvestor,
	createAccount
};
