import { AccountData } from "@cosmjs/amino";
import * as actions from "redux/actionTypes/mainActionTypes";
import { RPCService } from "redux/services";
import { ApiStatus, Network } from "types";

const LOCAL_NETWORK: Network = {
  name: "localhost 8545",
  rpcUrl: "http://localhost:8545",
  token: {
    decimal: 18,
    denom: "PHOTON",
  },
  extraTokens: [],
};

const YET_ANOTHER_NETWORK: Network = {
  name: "localhost duplicate ",
  rpcUrl: "http://localhost:8545",
  token: {
    decimal: 18,
    denom: "BOB",
  },
  extraTokens: [],
};

export interface MainState {
  service?: RPCService;
  serviceStatus: ApiStatus;
  networks: Network[];
  accounts: AccountData[];
  hasStoredWallet: boolean;
  currentNetworkIndex: number;
  importTokenModalVisible: boolean;
  balances: any;
  walletLoading: boolean;
}

const initialState: MainState = {
  networks: [LOCAL_NETWORK, YET_ANOTHER_NETWORK],
  service: undefined,
  serviceStatus: ApiStatus.NONE,
  accounts: [],
  hasStoredWallet: false,
  currentNetworkIndex: 0,
  importTokenModalVisible: false,
  balances: {},
  walletLoading: false,
};

export default function lyricsReducer(
  state: MainState = initialState,
  action: actions.MainAction
): MainState {
  switch (action.type) {
    case actions.SET_MAIN_STATE:
      return { ...state, ...action.state };
    case actions.SET_ACCOUNTS:
      return { ...state, accounts: action.accounts };
    default:
      return state;
  }
}
