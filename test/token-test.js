const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoToken", function () {
	let CryptoToken
	let cryptoToken
	let totalSupply
	let owner
	let accounts
	beforeEach(async function() {
		[owner, ...accounts] = await ethers.getSigners()
		totalSupply = 1000;
		CryptoToken = await ethers.getContractFactory("CryptoToken", owner);
		cryptoToken = await CryptoToken.deploy(totalSupply);
		await cryptoToken.deployed();
	})
	it("Should return a total supply as the Owner balance.", async function () {
		
		expect(await cryptoToken.totalSupply()).to.equal(await cryptoToken.balanceOf(owner.address));

		
	});

	it("Should be able to transfer to another account.", async function () {
		const amountToTransfer = 50
		const setTransferTx = await cryptoToken.transfer(accounts[0].address, amountToTransfer);

		// wait until the transaction is mined
		await setTransferTx.wait();

		expect(await cryptoToken.balanceOf(owner.address)).to.equal(totalSupply - amountToTransfer);
		expect(await cryptoToken.balanceOf(accounts[0].address)).to.equal(amountToTransfer);
	});

	it("Should be able to transfer to back.", async function () {
		const amountToTransfer = 50
		const setTransferTx = await cryptoToken.transfer(accounts[0].address, amountToTransfer);

		// wait until the transaction is mined
		await setTransferTx.wait();

		expect(await cryptoToken.balanceOf(owner.address)).to.equal(totalSupply - amountToTransfer);
		expect(await cryptoToken.balanceOf(accounts[0].address)).to.equal(amountToTransfer);

		const amountToTransfer2 = 30
		const setTransferTx2 = await cryptoToken.connect(accounts[0])
		.transfer(owner.address, amountToTransfer2);

		// wait until the transaction is mined
		await setTransferTx2.wait();

		expect(await cryptoToken.balanceOf(owner.address))
		.to.equal(totalSupply - amountToTransfer + amountToTransfer2);
		expect(await cryptoToken.balanceOf(accounts[0].address))
		.to.equal(amountToTransfer - amountToTransfer2);
	});
	it("Should not be able to transfer with insuficient balance.", async function () {
		const amountToTransfer = 50

		expect(await cryptoToken.balanceOf(owner.address)).to.equal(totalSupply);
		expect(await cryptoToken.balanceOf(accounts[0].address)).to.equal(0);

		await expect(cryptoToken.connect(accounts[0])
		.transfer(owner.address, amountToTransfer))
		.to.be.revertedWith("Insufficient Balance to Transfer");

		expect(await cryptoToken.balanceOf(owner.address)).to.equal(totalSupply);
		expect(await cryptoToken.balanceOf(accounts[0].address)).to.equal(0);
		
	})
});
