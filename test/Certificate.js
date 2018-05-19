const Certificate = artifacts.require("Certificate");

const utils = require("./utils");
const expect = utils.expect;
const expectThrow = utils.expectThrow;

contract('Certificate', function([creator, teamAddress, someGuy, eagerGuy]) {
	before(async function() {
		this.certificate = await Certificate.new(teamAddress, "Charity");
	});

	it("should have correct description", async function() {
		expect(await this.certificate.description()).to.be.equal("Charity");
	});

	it("should have correct owner", async function() {
		expect(await this.certificate.owner()).to.be.equal(teamAddress);
		expect(await this.certificate.checkOwner(teamAddress)).to.be.equal(true);
		expect(await this.certificate.checkOwner(someGuy)).to.be.equal(false);
	});

	it("anyone should be able to confirm validity of certificate", async function() {
		expect(await this.certificate.confirmedBy(someGuy)).to.be.equal(false);

		await this.certificate.confirm({ from: someGuy });

		expect(await this.certificate.confirmedBy(someGuy)).to.be.equal(true);

		expect(await this.certificate.confirmations(0)).to.be.equal(someGuy);
	});

	it("the same person should fail to confirm certificate again", async function() {
		await expectThrow(this.certificate.confirm({ from: someGuy }));

		expect(await this.certificate.confirmations(0)).to.be.equal(someGuy);

		await expectThrow(this.certificate.confirmations(1));
	});

	it("owner should be able to change metadata of certificate", async function() {
		await this.certificate.changeMetadata("Link to proof", { from: teamAddress });

		expect(await this.certificate.metadata()).to.be.equal("Link to proof");
		expect(await this.certificate.description()).to.be.equal("Charity");
	});

	it("bot should be able to proxify confirmation from oracle", async function() {
		const message = this.certificate.address;
		const signature = web3.eth.sign(eagerGuy, web3.sha3(message));

		await this.certificate.confirmFrom(eagerGuy, message, signature);

		expect(await this.certificate.isConfirmedBy(eagerGuy)).to.be.equal(true);
	});
});