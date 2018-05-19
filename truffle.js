const HDWalletProvider = require('truffle-hdwallet-provider');

const fs = require('fs');
const path = require('path');

let mnemonic = '';

if(fs.existsSync(path.resolve(__dirname, "mnemonic"))) {
	mnemonic = fs.readFileSync(path.resolve(__dirname, "mnemonic")).toString().trim();
} else {
	console.log("Mnemonic not found");
}

let config = {};
config.networks = {};

config.networks.development = {
	host: "localhost",
	port: 8545,
	gas: 4e6,
	gasPrice: 1,
	network_id: "*"
};

config.networks.nomigration = {
	host: "localhost",
	port: 8545,
	gas: 4e6,
	gasPrice: 1,
	network_id: "*"
};

if(mnemonic.length > 0) {
	config.networks.mainnet = {
		provider: new HDWalletProvider(mnemonic, "https://mainnet.infura.io/jPkVat66IVKkmtAsy0DJ"),
		network_id: 1,
		gas: 4e6,
		gasPrice: 5e9
	};

	config.networks["ropsten"] = {
		provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/jPkVat66IVKkmtAsy0DJ"),
		network_id: 3,
		gas: 4e6,
		gasPrice: 80e9
	};
}

module.exports = config;