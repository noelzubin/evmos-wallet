import {
  put,
  call,
  takeEvery,
  takeLatest,
  takeLeading,
} from "redux-saga/effects";

// import { fetchLyrics } from "../services/lyricsServices";
// import * as actionCreators from "../actionCreators/lyricsActionCreators";
import * as actionTypes from "redux/actionTypes/mainActionTypes";
import * as mainActions from "redux/actionCreators/mainActionCreators";
import { select } from "redux-saga/effects";
import { ApiStatus, ERC20Token, Network } from "types";
import { RPCService } from "redux/services";
import * as cryptoUtils from "utils/crypto";
import {
  AccountData,
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing";
import { getWallet, setWallet } from "utils/localStorage";
import { message } from "antd";
import { Bech32, toHex } from "@cosmjs/encoding";
import { MainState } from "redux/reducers/mainReducer";
import { RootStateOrAny } from "react-redux";
import { AppState } from "redux/reducers";
import { convertToObject, tokenToString } from "typescript";

function* onConnectNetwork({ index }: actionTypes.ConnectNetworkAction) {
  const networks: Network[] = yield select((state) => state.main.networks);
  const service = new RPCService(networks[index].rpcUrl);
  yield put(
    mainActions.setState({
      service,
      serviceStatus: ApiStatus.PENDING,
      currentNetworkIndex: index,
    })
  );
  try {
    // check if network connection succesful
    yield service.init();
    yield put(mainActions.setState({ serviceStatus: ApiStatus.SUCESSS }));
  } catch (e) {
    yield put(mainActions.setState({ serviceStatus: ApiStatus.FAILED }));
    console.error(e);
  }
}

function* loadLocalAccounts() {
  const encrypted = getWallet();
  if (!encrypted) return;

  yield put(mainActions.setState({ hasStoredWallet: true }));
}

function* createWallet() {
  yield put(mainActions.setState({ walletLoading: true }));
  const wallet: DirectSecp256k1Wallet = yield cryptoUtils.createWallet();
  const accounts: AccountData[] = yield wallet.getAccounts();
  yield put(mainActions.setAccounts(accounts));
}

function* unlockWallet({ password }: actionTypes.UnlockWalletAction) {
  const encrypted = getWallet();
  try {
    const wallet: DirectSecp256k1HdWallet =
      yield DirectSecp256k1HdWallet.deserialize(encrypted!, password);
    yield put(mainActions.setAccounts(yield wallet.getAccounts()));
  } catch (e) {
    message.error("Password is incorrect");
  }
}

function* restoreMnemonic({ mnemonic }: actionTypes.RestoreMnemonicAction) {
  let wallet: DirectSecp256k1HdWallet;

  try {
    wallet = yield DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "evmos",
    });
  } catch (e) {
    console.error(e);
    message.error("unable to decode mnemonic");
    return;
  }

  let password: string | null = null;

  while (!password) {
    password = prompt("New Password");
  }

  wallet.serialize(password).then(function (json) {
    console.log(json);
    setWallet(json);
  });

  const accounts: AccountData[] = yield wallet.getAccounts();
  yield put(mainActions.setAccounts(accounts));
}

function* fetchBalances(
  accounts: AccountData[],
  extraTokens: ERC20Token[] = []
) {
  const { service, currentNetworkIndex, networks }: MainState = yield select(
    mainStateSelector
  );

  const network: Network = networks[currentNetworkIndex];

  const balances: any = {};

  yield Promise.all(
    accounts.map(async (acc) => {
      const hexAddr = "0x" + toHex(Bech32.decode(acc.address).data);
      const bal = await service!.getBalance(hexAddr);
      balances[acc.address] = { [network.token.denom]: bal };
    })
  );

  let promises: Promise<any>[] = [];

  extraTokens.forEach((token) => {
    promises = promises.concat(
      accounts.map(async (acc) => {
        const hexAddr = "0x" + toHex(Bech32.decode(acc.address).data);
        const bal = await service?.getERC20Balance(
          hexAddr,
          token.contractAddress
        );
        balances[acc.address][token.symbol] = bal;
      })
    );
  });

  yield Promise.all(promises);

  yield put(mainActions.setState({ balances }));
}

function* setAccounts({ accounts }: actionTypes.SetAccountsAction) {
  const { currentNetworkIndex, networks }: MainState = yield select(
    mainStateSelector
  );
  yield fetchBalances(accounts, networks[currentNetworkIndex].extraTokens);
}

function* addToken({ addr }: actionTypes.AddTokenAction) {
  const { service, networks, currentNetworkIndex, accounts }: MainState =
    yield select(mainStateSelector);

  try {
    let token: ERC20Token = yield service?.getERC20Info(addr);
    console.log(token);
    let extraTokens;

    const newNetworks = networks.map((nt, ind) => {
      if (ind === currentNetworkIndex) {
        extraTokens = [...nt.extraTokens, token];
        return {
          ...nt,
          extraTokens: [...nt.extraTokens, token],
        };
      }
      return nt;
    });

    yield fetchBalances(accounts, extraTokens);

    yield put(
      mainActions.setState({
        networks: newNetworks,
        importTokenModalVisible: false,
      })
    );
  } catch (e) {
    message.error("failed to fetch token");
    console.error(e);
  }
}

export default [
  takeLatest(actionTypes.CONNECT_NETWORK, onConnectNetwork),
  takeEvery(actionTypes.LOAD_LOCAL_ACCOUNTS, loadLocalAccounts),
  takeEvery(actionTypes.CREATE_WALLET, createWallet),
  takeLeading(actionTypes.UNLOCK_WALLET, unlockWallet),
  takeLeading(actionTypes.RESTORE_MNEMONIC, restoreMnemonic),
  takeEvery(actionTypes.SET_ACCOUNTS, setAccounts),
  takeEvery(actionTypes.ADD_TOKEN, addToken),
];

const mainStateSelector: (state: AppState) => MainState = (state) => state.main;
