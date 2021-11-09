import { AccountData, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Wallet } from "@ethersproject/wallet";
import { MainState } from "redux/reducers/mainReducer";

export const SET_USER = "mainActionTypes/SET_USER";
export interface SetUserAction {
  type: typeof SET_USER;
  x: string;
}

export const CONNECT_NETWORK = "mainActionTypes/CONNECT_NETWORK";
export interface ConnectNetworkAction {
  type: typeof CONNECT_NETWORK;
  index: number;
}

export const SET_WALLETS = "mainActionTypes/SET_WALLETS";
export interface SetWalletAction {
  type: typeof SET_WALLETS;
  wallets: DirectSecp256k1HdWallet[];
}

export const SET_MAIN_STATE = "mainActionTypes/SET_MAIN_STATE";
export interface SetMainStateAction {
  type: typeof SET_MAIN_STATE;
  state: Partial<MainState>;
}

export const SET_ACCOUNTS = "mainActionTypes/SET_ACCOUNTS";
export interface SetAccountsAction {
  type: typeof SET_ACCOUNTS;
  accounts: AccountData[];
}

export const LOAD_LOCAL_ACCOUNTS = "mainActionTypes/LOAD_LOCAL_ACCOUNTS";
export interface LoadLocalAccountsAction {
  type: typeof LOAD_LOCAL_ACCOUNTS;
}

export const CREATE_WALLET = "mainActionTypes/CREATE_WALLET";
export interface CreateWalletAction {
  type: typeof CREATE_WALLET;
}

export const UNLOCK_WALLET = "mainActionTypes/UNLOCK_WALLET";
export interface UnlockWalletAction {
  type: typeof UNLOCK_WALLET;
  password: string;
}

export const RESTORE_MNEMONIC = "mainActionTypes/RESTORE_MNEMONIC";
export interface RestoreMnemonicAction {
  type: typeof RESTORE_MNEMONIC;
  mnemonic: string;
}

export const ADD_TOKEN = "mainActionTypes/ADD_TOKEN";
export interface AddTokenAction {
  type: typeof ADD_TOKEN;
  addr: string;
}

export const FETCH_NETWORK_BALANCES = "mainActionTypes/FETCH_NETWORK_BALANCES";
export interface FetchNetworkBalancesAction {
  type: typeof FETCH_NETWORK_BALANCES;
}

export type MainAction =
  | SetUserAction
  | ConnectNetworkAction
  | SetWalletAction
  | SetMainStateAction
  | LoadLocalAccountsAction
  | SetAccountsAction
  | UnlockWalletAction
  | RestoreMnemonicAction
  | FetchNetworkBalancesAction;
