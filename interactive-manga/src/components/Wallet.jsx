import {
    ThirdwebProvider,
    ConnectWallet,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    localWallet,
  } from "@thirdweb-dev/react";


  export default function Wallet() {

    const YOUR_CLIENT_ID = process.env.CLIENT_ID;

    return (
      <ThirdwebProvider
        activeChain="mumbai"
        clientId={YOUR_CLIENT_ID}
        supportedWallets={[
          metamaskWallet({ recommended: true }),
          coinbaseWallet(),
          walletConnect(),
          localWallet(),
        ]}
      >
        <ConnectWallet
          theme={"dark"}
          switchToActiveChain={true}
          modalSize={"wide"}
        />
      </ThirdwebProvider>
    );
  }