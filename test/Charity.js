const Charity = artifacts.require("Charity");
const EligibilityCheck = artifacts.require("EligibilityCheck");
const Token = artifacts.require("Token");
const Certificate = artifacts.require("Certificate");


const utils = require("./utils");
const expect = utils.expect;
const expectThrow = utils.expectThrow;

contract('Charity', function([creator, participant1, participant2, participant3]) {
	before(async function() {
		this.certificate1 = await Certificate.new(participant1, "Charity receiver");
		this.certificate2 = await Certificate.new(participant2, "Charity receiver");
		this.certificate3 = await Certificate.new(participant3, "Charity receiver");

		this.participants = [participant1, participant2, participant3];
		this.certificates = [this.certificate1.address, this.certificate2.address, this.certificate3.address];

		this.check = await EligibilityCheck.new(this.participants, this.certificates);

		this.token = await Token.new(10000);

		this.charity = await Charity.new(this.check.address, this.token.address);
		await this.token.transfer(this.charity.address, 10000);

		await this.certificate1.confirm({ from: participant1 });
		await this.certificate2.confirm({ from: participant1 });
		await this.certificate2.confirm({ from: participant2 });

		await this.check.finishVoting();
	});

	it("should have correct conditions", async function() {
		expect(await this.charity.conditions()).to.be.equal(this.check.address);
	});

	it("should have correct token", async function() {
		expect(await this.charity.charityToken()).to.be.equal(this.token.address);
	});

	it("owner of non-eligible certificate can't claim tokens", async function() {
		await expectThrow(this.charity.claim(this.certificate1.address));
	});

	it("owner of eligible certificate can claim tokens", async function() {
		await this.charity.claim(this.certificate2.address, { from: participant2 });
	});

	it("should fail to claim more than once", async function() {
		await expectThrow(this.charity.claim(this.certificate2.address));
	});

	it("amount of tokens left is exactly determined", async function() {
		var balance = await this.token.balanceOf(this.charity.address);
		await expect(balance.toNumber()).to.be.equal(5000);
	});
});
