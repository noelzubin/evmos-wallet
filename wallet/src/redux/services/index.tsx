import { Network } from "types";
import Web3 from "web3";
import { AbiItem } from "web3-utils/types/index";
import { ERC20Token } from "types";
import { decodeAminoPubkey } from "@cosmjs/amino";

// The minimum ABI required to get the ERC20 Token Info
const minABI: AbiItem[] = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  // name
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  // symbol
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export class RPCService {
  web3: Web3;

  constructor(rpcUrl: string) {
    this.web3 = new Web3(rpcUrl);
  }

  public async init() {
    await this.web3.eth.getProtocolVersion();
  }

  async getBalance(address: string): Promise<string> {
    return this.web3.eth.getBalance(address);
  }
  async getERC20Balance(
    walletAddress: string,
    contractAddress: string
  ): Promise<string> {
    const contract = new this.web3.eth.Contract(minABI, contractAddress);

    const result = await contract.methods.balanceOf(walletAddress).call(); // 29803630997051883414242659
    return result;
  }

  async getERC20Info(contractAddress: string): Promise<ERC20Token> {
    const contract = new this.web3.eth.Contract(minABI, contractAddress);

    const token: ERC20Token = {
      contractAddress: contractAddress,
      decimals: 0,
      symbol: "",
    };
    await Promise.all([
      contract.methods
        .decimals()
        .call()
        .then((val: number) => (token.decimals = val)),
      contract.methods
        .symbol()
        .call()
        .then((val: string) => (token.symbol = val)),
    ]);

    return token;
  }
}

export class ETHRPC extends RPCService {}
