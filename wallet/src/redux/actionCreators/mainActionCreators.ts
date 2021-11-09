import { AccountData, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Wallet } from "@ethersproject/wallet";
import * as actions from "redux/actionTypes/mainActionTypes";
import { MainState } from "redux/reducers/mainReducer";

export function setWallets(
  wallets: DirectSecp256k1HdWallet[]
): actions.SetWalletAction {
  return {
    type: actions.SET_WALLETS,
    wallets,
  };
}

export function connectNetwork(index: number): actions.ConnectNetworkAction {
  return {
    type: actions.CONNECT_NETWORK,
    index,
  };
}

export function createWallet(): actions.CreateWalletAction {
  return {
    type: actions.CREATE_WALLET,
  };
}

export function setState(
  state: Partial<MainState>
): actions.SetMainStateAction {
  return { type: actions.SET_MAIN_STATE, state };
}

export function setAccounts(
  accounts: AccountData[]
): actions.SetAccountsAction {
  return {
    type: actions.SET_ACCOUNTS,
    accounts,
  };
}

export function loadLocalAccounts(): actions.LoadLocalAccountsAction {
  return { type: actions.LOAD_LOCAL_ACCOUNTS };
}

export function unlockWallet(password: string): actions.UnlockWalletAction {
  return { type: actions.UNLOCK_WALLET, password };
}

export function addToken(addr: string): actions.AddTokenAction {
  return { type: actions.ADD_TOKEN, addr };
}

export function restoreMnemonic(
  mnemonic: string
): actions.RestoreMnemonicAction {
  return { type: actions.RESTORE_MNEMONIC, mnemonic };
}

export function fetchNetworkBalances(): actions.FetchNetworkBalancesAction {
  return {
    type: actions.FETCH_NETWORK_BALANCES,
  };
}
