const BigNumber = web3.BigNumber;
const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-bignumber')(BigNumber));
const expect = chai.expect;

const expectThrow = async (promise) => {
	try {
		await promise;
	} catch (error) {
		const invalidOpcode = error.message.search('invalid opcode') >= 0;
		const outOfGas = error.message.search('out of gas') >= 0;
		const revert = error.message.search('revert') >= 0;

		assert(invalidOpcode || outOfGas || revert,
			"Expected throw, got '" + error + "' instead");

		return;
	}

	assert.fail('Expected throw not received');
}

const expectInvalidOpcode = async (promise) => {
	try {
		await promise;
	}
	catch (error) {
		expect(error.message).to.include('invalid opcode')
		return;
	}
	expect.fail('Expected throw not received');
}

const expectInvalidJump = async (promise) => {
	try {
		await promise;
	}
	catch (error) {
		expect(error.message).to.include('invalid JUMP');
		return;
	}
	expect.fail('Expected throw not received')
}

const expectOutOfGas = async (promise) => {
	try {
		await promise;
	}
	catch (error) {
		expect(error.message).to.include('out of gas');
		return;
	}
	expect.fail('Expected throw not received');
}

const ether = (amount) => {
	return new web3.BigNumber(web3.toWei(amount, 'ether'));
}

const getBalance = (address) => {
	return web3.fromWei(web3.eth.getBalance(address).toString(), 'ether');
}

const inEther = (amountInWei) => {
	return web3.fromWei(amountInWei, 'ether');
}

const inWei = (amountInEther) => {
	return web3.toWei(amountInEther, 'ether');
}

const tokenWei = (decimals) => (amountInTokens) => {
	return amountInTokens * (10 ** decimals);
}

const inBaseUnits = (decimals) => (tokens) => {
	return new web3.BigNumber(tokens).mul(new web3.BigNumber(10).pow(decimals));
}

const inTokenUnits = (decimals) => (tokenBaseUnits) => {
	return tokenBaseUnits / (10 * decimals);
}

const equivalentTokenBaseUnits = (rate) => (wei) => {
	return rate * wei;
}

const equivalentTokenUnits = (decimals) => (rate) => (wei) => {
	return rate * wei / (10 ** decimals);
}

const latestTime = () => web3.eth.getBlock('latest').timestamp;

const increaseTime = (duration) => {
	const id = Date.now();

	return new Promise((resolve, reject) => {
		web3.currentProvider.sendAsync({
			jsonrpc: '2.0',
			method: 'evm_increaseTime',
			params: [duration],
			id
		}, err => {
			if(err) return reject(err);

			web3.currentProvider.sendAsync({
				jsonrpc: '2.0',
				method: 'evm_mine',
				id: id+1
			}, (err, res) => {
				if(err) return reject(err);

				resolve(res);
			})
		})
	})
}

const advanceBlock = () => {
	return new Promise((resolve, reject) => {
		web3.currentProvider.sendAsync({
			jsonrpc: '2.0',
			method: 'evm_mine',
			id: Date.now()
		}, (err, res) => {
			if(err) return reject(err);

			return resolve(res);
		})
	})
}

const advanceToBlock = async (number) => {
	if(web3.eth.blockNumber > number)
		throw Error("invalid block number");

	while(web3.eth.blockNumber < number) {
		await advanceBlock();
	}
}

const setTime = (target) => {
	let diff = target - latestTime();
	if(diff <= 0) throw new Error("invalid target time");

	return increaseTime(diff);
}

module.exports = {
	expectInvalidOpcode,
	expectInvalidJump,
	expectOutOfGas,
	expectThrow,
	ether,
	getBalance,
	inEther,
	inWei,
	equivalentTokenBaseUnits,
	equivalentTokenUnits,
	inBaseUnits,
	inTokenUnits,
	latestTime,
	increaseTime,
	setTime,
	advanceBlock,
	advanceToBlock
};

module.exports.expect = expect;