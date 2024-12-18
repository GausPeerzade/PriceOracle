import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { StargateClient, GasPrice, coin } from "@cosmjs/stargate";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";

const rpc = "https://rpc.xion-testnet-1.burnt.com:443";

const mnemonic = process.env.MNEMONIC;
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
  prefix: "xion",
});

process.stdout.write(wallet.mnemonic);

const [account] = await wallet.getAccounts();

console.log("accouint is", account);

const client = await SigningCosmWasmClient.connectWithSigner(rpc, wallet, {
  gasPrice: GasPrice.fromString("0.001uxion"),
});

let ore = "xion1we0j6wah6w3khzl32z77m2hs798raf9lgstqlg0lslyxld5ttkjsyxlj46";
let earthcore =
  "xion1frafggn3p7vc7sn92ednn7uq26caqscdsnxhc4qxgkd2l6zdxlhqm93209";

async function setPrice() {
  let priceMsg = {
    set_price: {
      price: "3800000",
    },
  };

  const priceRes = await client.execute(
    account.address,
    earthcore,
    priceMsg,
    "auto"
  );

  console.log(priceRes);
  console.log("price set sucessfull");
}

setPrice();
