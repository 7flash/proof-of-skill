const Certificate = artifacts.require("Certificate");
const ChampionSearch = artifacts.require("ChampionSearch");

const utils = require("./utils");
const expect = utils.expect;
const expectThrow = utils.expectThrow;

contract('ChampionSearch', function([creator, participant1, participant2, participant3]) {
	before(async function() {
		this.certificate1 = await Certificate.new(participant1, "Winner of Hackaton");
		this.certificate2 = await Certificate.new(participant2, "Winner of Hackaton");
		this.certificate3 = await Certificate.new(participant3, "Winner of Hackaton");

		this.participants = [participant1, participant2, participant3];
		this.certificates = [this.certificate1.address, this.certificate2.address, this.certificate3.address];

		this.search = await ChampionSearch.new(this.participants, this.participants, this.certificates);

		await this.certificate1.confirm({ from: participant1 });
		await this.certificate2.confirm({ from: participant1 });
		await this.certificate2.confirm({ from: participant2 });
	});

	it("should have oracles", async function() {
		expect(await this.search.oracles(0)).to.be.equal(participant1);
		expect(await this.search.oracles(1)).to.be.equal(participant2);
		expect(await this.search.oracles(2)).to.be.equal(participant3);
	});

	it("should have candidates", async function() {
		expect(await this.search.candidates(0)).to.be.equal(participant1);
		expect(await this.search.candidates(1)).to.be.equal(participant2);
		expect(await this.search.candidates(2)).to.be.equal(participant3);
	});

	it("should have certificates", async function() {
		expect(await this.search.certificates(0)).to.be.equal(this.certificate1.address);
		expect(await this.search.certificates(1)).to.be.equal(this.certificate2.address);
		expect(await this.search.certificates(2)).to.be.equal(this.certificate3.address);
	});

	it("should fail to check winner when voting is not finished", async function() {
		await expectThrow(this.search.check(this.certificate2.address));
	});

	it("should return true for winner", async function() {
		await this.search.finishVoting();

		expect(await this.search.check(this.certificate2.address)).to.be.equal(true);
	});

	it("should return false for non-winner", async function() {
		expect(await this.search.check(this.certificate1.address)).to.be.equal(false);
	});
});