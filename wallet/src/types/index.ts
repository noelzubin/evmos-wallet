export interface Network {
  name: string;
  rpcUrl: string;
  token: {
    denom: string;
    decimal: number;
  };
  extraTokens: ERC20Token[];
}

export enum ApiStatus {
  NONE,
  PENDING,
  FAILED,
  SUCESSS,
}

export interface ERC20Token {
  symbol: string;
  decimals: number;
  contractAddress: string;
}
