import { expect } from "chai";
import { ethers } from "hardhat";
import { YourToken } from "../typechain-types";

describe("YourToken", function () {
  let yourToken: YourToken;
  let owner: any;
  let addr1: any;
  let addr2: any;
  const TOTAL_SUPPLY = ethers.parseEther("21000000"); // 21 million tokens

  beforeEach(async () => {
    // Using beforeEach instead of before to reset state for each test
    [owner, addr1, addr2] = await ethers.getSigners();
    const yourTokenFactory = await ethers.getContractFactory("YourToken");
    yourToken = (await yourTokenFactory.deploy(owner.address)) as YourToken;
    await yourToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await yourToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await yourToken.balanceOf(owner.address);
      expect(await yourToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct total supply", async function () {
      expect(await yourToken.totalSupply()).to.equal(TOTAL_SUPPLY);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 100 tokens from owner to addr1
      await yourToken.transfer(addr1.address, ethers.parseEther("100"));
      expect(await yourToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));

      // Transfer 50 tokens from addr1 to addr2
      await yourToken.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));
      expect(await yourToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("50"));
      expect(await yourToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("50"));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      // Try to send 1 token from addr1 (who has 0 tokens)
      await expect(yourToken.connect(addr1).transfer(owner.address, ethers.parseEther("1"))).to.be.reverted;
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await yourToken.balanceOf(owner.address);
      const transferAmount = ethers.parseEther("100");

      // Transfer 100 tokens from owner to addr1
      await yourToken.transfer(addr1.address, transferAmount);

      // Check balances
      const finalOwnerBalance = await yourToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - transferAmount);
      expect(await yourToken.balanceOf(addr1.address)).to.equal(transferAmount);
    });
  });

  describe("Allowances", function () {
    it("Should approve tokens for delegated transfer", async function () {
      const approveAmount = ethers.parseEther("100");
      await yourToken.approve(addr1.address, approveAmount);
      expect(await yourToken.allowance(owner.address, addr1.address)).to.equal(approveAmount);
    });

    it("Should transfer tokens using allowance", async function () {
      const allowanceAmount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("50");

      // Approve addr1 to spend 100 tokens
      await yourToken.approve(addr1.address, allowanceAmount);

      // addr1 transfers 50 tokens from owner to addr2
      await yourToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);

      // Check balances
      expect(await yourToken.balanceOf(addr2.address)).to.equal(transferAmount);
      // Check remaining allowance
      expect(await yourToken.allowance(owner.address, addr1.address)).to.equal(allowanceAmount - transferAmount);
    });

    it("Should fail when trying to transfer more than allowed", async function () {
      const allowanceAmount = ethers.parseEther("100");

      // Approve addr1 to spend 100 tokens
      await yourToken.approve(addr1.address, allowanceAmount);

      // Try to transfer 101 tokens
      await expect(yourToken.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseEther("101"))).to.be
        .reverted;
    });
  });
});
