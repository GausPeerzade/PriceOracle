import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { StargateClient, GasPrice, coin } from "@cosmjs/stargate";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const apiKey = process.env.API;

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
  let price = await getPrice();
  console.log("price is", price);
  let priceMsg = {
    set_price: {
      price: (price * 1000000).toFixed(0).toString(),
    },
  };
  console.log("price is", priceMsg);
  const priceRes = await client.execute(
    account.address,
    earthcore,
    priceMsg,
    "auto"
  );

  console.log(priceRes);
  console.log("price set sucessfull");
}

async function getPrice() {
  try {
    const symbol = "XION";
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      {
        params: {
          symbol: symbol,
          convert: "USD",
        },
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
        },
      }
    );
    const price = response.data.data[symbol].quote.USD.price;
    console.log("price here", price);
    return price; // Return the fetched price
  } catch (error) {
    console.error("Error fetching price:", error);
    throw error; // Throw error to handle it in the calling function
  }
}

setInterval(async () => {
  await setPrice();
}, 3000000);
