# ethereum-web-wallet
A web3 wallet browser extension connecting you to the world of DeFi

The aim of this Ethereum web wallet is to help people better understand the very transactions they are making *before* signing them and sending them off. We provide a number of features that attempt to catch a number of potentially costly mistakes that other wallets do not: trying to call a function at an address that isn't actually a contract, sending a token to the token's own contract, specifying a gas limit that is too low. Inspired by popular block explorers, we also give users a window into what (potentially) will happen when a transaction lands on the blockchain by showing the token transfers all before the transaction is even signed.

Many other Ethereum wallets do not adequately take advantage of the rich information afforded by a smart contract enabled blockchain. We hope that our innovations in wallet design spur new growth and interest into making Ethereum and other EVM-compatible blockchains more usable.

## Build the extension

#### Install packages & build
```
npm install
npm run build
```

#### Run backend unit tests
We use Chai/Mocha for testing TypeScript:
```
npm run test-backend
```

#### Lint your code
```
# Show lint results
npm run lint
# Fix as many lint errors as possible automatically and display results
npm run lint -- --fix
```

## Load the extension in your browser
You can load a temporary add-on using the following steps. Both browsers have a button that reloads the extension in a single click.
* Chrome/Chromium: `chrome://extensions` -> Developer Mode -> Load unpacked
* Firefox: `about:debugging` -> This Firefox -> Load Temporary Add-on...

You have to reload the extension in the browser after every build. There should be a "reload" button.

#### Enabling the log tracer
Our wallet has a special feature that lets users view the (probable) token transfers emitted by a
transaction *prior* to the transaction actually being sent. To enable this feature, you must be
running `geth` matching your target network with the RPC endpoint enabled on 8545, the
default port, and the debug namespace enabled. For this feature, we currently only support
Chromium-like browsers.