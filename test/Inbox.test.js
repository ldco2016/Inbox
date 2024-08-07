const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require("../compile");

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["hi there"],
    })
    .send({ from: accounts[0], gas: "1000000" });

  inbox.setProvider(provider);
});

describe("inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "hi there");
  });
});
