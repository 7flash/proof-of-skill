const ECRecovery = artifacts.require("ECRecovery");

let participants = [];
let teams = [];

let certificates = [];

const tokenAddress = "";

module.exports = function(deployer, network, accounts) {
	if(network === 'development') return false;

	const title = "Winner of Hackaton";

	let search = null;

	deployer.then(function() {
		return deployer.deploy(ECRecovery);
	}).then(function(instance) {
		return deployer.link(ECRecovery, Certificate);
	});

	for(let i = 0; i < participants.length; i++) {
		deployer.then(function() {
			const participant = participants[i];

			return Certificate.new(participant, title);
		}).then(function(instance) {
			certificates.push(instance.address);
		});
	}

	deployer.then(function() {
		return deployer.deploy(ChampionSearch, participants, certificates);
	}).then(function(instance) {
		search = instance;
	});

	deployer.then(function() {
		return deployer.deploy(Hackaton, search.address, tokenAddress);
	});
}