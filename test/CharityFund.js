const CharityFund = artifacts.require("CharityFund");
const EligibilityCheck = artifacts.require("EligibilityCheck");
const Token = artifacts.require("Token");
const Certificate = artifacts.require("Certificate");


const utils = require("./utils");
const expect = utils.expect;
const expectThrow = utils.expectThrow;

contract('CharityFund', function([verifier, participant1, participant2, participant3, patron1, patron2]) {
	before(async function() {
		this.certificate1 = await Certificate.new(participant1, "Charity receiver");
		this.certificate2 = await Certificate.new(participant2, "Charity receiver");
		this.certificate3 = await Certificate.new(participant3, "Charity receiver");

		this.participants = [patron1, patron2];
		this.certificates = [this.certificate1.address, this.certificate2.address];

		this.check = await CharityFundCheck.new(this.participants, this.certificates);

		this.token = await Token.new(1000);
		await this.token.transfer(patron1, 200);
		await this.token.transfer(patron2, 300);

		this.charity = await CharityFund.new(this.check.address, this.token.address);

		await this.certificate1.confirm({ from: verifier });
		await this.certificate2.confirm({ from: verifier });

		await this.charity.fund(this.certificate1, 100, {from: patron1});
		await this.charity.fund(this.certificate2, 200, {from: patron1});
		await this.charity.fund(this.certificate2, 150 {from: patron2});

		await this.charity.claim(this.certificate1, {from: participant1});
	});

	it("should have correct conditions", async function() {
		expect(await this.charity.conditions()).to.be.equal(this.check.address);
	});

	it("should have correct token", async function() {
		expect(await this.charity.charityToken()).to.be.equal(this.token.address);
	});

	it("owner of non-confirmed certificate can't claim tokens", async function() {
		await expectThrow(this.charity.claim(this.certificate3.address));
	});

	it("owner of confirmed certificate can claim tokens", async function() {
		await this.charity.claim(this.certificate1.address, { from: participant1 });
	});

	it("should fail if no tokens to claim", async function() {
		await expectThrow(this.charity.claim(this.certificate1.address));
	});

	it("amount of tokens left is exactly determined", async function() {
		var balance = await this.token.balanceOf(this.charity.address);
		await expect(balance.toNumber()).to.be.equal(350);
	});
});
