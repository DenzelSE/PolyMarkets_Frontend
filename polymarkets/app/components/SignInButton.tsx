import { ConnectButton } from "thirdweb/react";
import { darkTheme } from "thirdweb/react";
import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";
import { thirdwebClient } from "../config/client";

import { defineChain } from "thirdweb";
import { contractConfig } from "../config/contractConfig";



const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

const {chainId,rpc} = contractConfig

const chain  = defineChain({id: chainId, rpc})

export function SignInButton() {

    
  return (
    <ConnectButton
      accountAbstraction = {{
        chain,
        sponsorGas: true,
      }}
      client={thirdwebClient}
      wallets={wallets}
      theme={darkTheme({
        colors: {
          borderColor: "hsl(228, 12%, 17%)",
          primaryText: "hsl(240, 6%, 94%)",
          primaryButtonBg: "hsl(215, 28%, 17%)",
          primaryButtonText: "hsl(0, 0%, 100%)",
        },
      })}
      connectModal={{ size: "compact" }}
    />
  );
}
