const Web3 = require("web3");

const web3 = new Web3("http://localhost:8545");

web3.extend({
  property: "myModule",
  methods: [
    {
      name: "getBalance",
      call: "eth_getBalance",
      params: 2,
      inputFormatter: [
        web3.extend.formatters.inputAddressFormatter,
        web3.extend.formatters.inputDefaultBlockNumberFormatter,
      ],
      outputFormatter: (value) => value,
      // web3.utils.hexToNumberString,
    },
    {
      name: "getGasPriceSuperFunction",
      call: "eth_gasPriceSuper",
      params: 2,
      inputFormatter: [null, web3.utils.numberToHex],
    },
  ],
});

const doo = async () => {
  let balance;
  balance = await web3.eth.getBalance(
    "0xC8C7D5889bdCcC32Ff75aBdF21402F77dF552A56"
  );
  console.log(balance);

  balance = await web3.myModule.getBalance(
    "0xC8C7D5889bdCcC32Ff75aBdF21402F77dF552A56"
  );
  console.log(balance);
};

doo();
