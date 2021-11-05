# ethereum-web-wallet
A web3 wallet connecting you to the world of DeFi

### Install packages
```
npm install
```

### Building the extension
```
npm run build
```

### Run backend unit tests
We use Chai/Mocha for testing TypeScript:
```
npm run test-backend
```

### Loading the extension
You can load a temporary add-on using the following steps. Both browsers have a button that reloads the extension in a single click.
* Chrome/Chromium: `chrome://extensions` -> Developer Mode -> Load unpacked
* Firefox: `about:debugging` -> This Firefox -> Load Temporary Add-on...

You have to reload the extension in the browser after every build. There should be a "reload" button.
