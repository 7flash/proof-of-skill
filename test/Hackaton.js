const Hackaton = artifacts.require("Hackaton");
const ChampionSearch = artifacts.require("ChampionSearch");
const Token = artifacts.require("Token");
const Certificate = artifacts.require("Certificate");


const utils = require("./utils");
const expect = utils.expect;
const expectThrow = utils.expectThrow;

contract('Hackaton', function([creator, participant1, participant2, participant3]) {
	before(async function() {
		this.certificate1 = await Certificate.new(participant1, "Winner of Hackaton");
		this.certificate2 = await Certificate.new(participant2, "Winner of Hackaton");
		this.certificate3 = await Certificate.new(participant3, "Winner of Hackaton");

		this.participants = [participant1, participant2, participant3];
		this.certificates = [this.certificate1.address, this.certificate2.address, this.certificate3.address];

		this.search = await ChampionSearch.new(this.participants, this.certificates);

		await this.certificate1.confirm({ from: participant1 });
		await this.certificate2.confirm({ from: participant1 });
		await this.certificate2.confirm({ from: participant2 });

		this.token = await Token.new(10000);

		this.hackaton = await Hackaton.new(this.search.address, this.token.address);

		await this.token.transfer(this.hackaton.address, 10000);

		await this.search.finishVoting();
	});

	it("should have correct conditions", async function() {
		expect(await this.hackaton.conditions()).to.be.equal(this.search.address);
	});

	it("should have correct token", async function() {
		expect(await this.hackaton.rewardToken()).to.be.equal(this.token.address);
	});

	it("owner of non-winner certificate should fail to win", async function() {
		await expectThrow(this.hackaton.win(this.certificate1.address));
	});

	it("owner of valid winner certificate should win", async function() {
		await this.hackaton.win(this.certificate2.address, { from: participant2 });
	});

	it("should fail to win again", async function() {
		await expectThrow(this.hackaton.win(this.certificate2.address));
	});
});