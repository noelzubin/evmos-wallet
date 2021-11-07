import { setWallet } from "./localStorage";
import { Wallet } from "@ethersproject/wallet";
import { bech32 } from "bech32";
import { generateMnemonic } from "bip39";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

export const createWallet = async () => {
  let password;
  while (!password) {
    password = prompt("Password");
  }

  const mnemonic = generateMnemonic();

  console.log(mnemonic);

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "evmos",
  });

  wallet.serialize(password).then(function (json) {
    console.log(json);
    setWallet(json);
  });

  return wallet;
};

export const hexAddressTobech = (hexAddress: string) => {
  const addressBytes = Buffer.from(hexAddress, "hex");
  const words = bech32.toWords(addressBytes);
  return bech32.encode("evmos", words);
};
