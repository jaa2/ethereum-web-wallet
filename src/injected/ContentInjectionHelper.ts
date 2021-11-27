import browser from 'webextension-polyfill';

// Load ContentInjection.js script into browser DOM, escaping the browser sandbox
const s = document.createElement('script');
s.src = browser.runtime.getURL('ContentInjection.js');
s.addEventListener('onload', () => {
  s.remove();
});
(document.head || document.documentElement).appendChild(s);

// Forward requests and responses
window.addEventListener('message', (event) => {
  // Only accept messages from this window
  if (event.source !== window) {
    return;
  }
  if (event.data && event.data.from === 'EthereumWebWallet') {
    // TODO: Allow only certain types of requests
    // Forward message to background window and return the response
    browser.runtime.sendMessage(undefined, {
      type: 'request',
      data: event.data.data,
    }).then((response) => {
      // eslint-disable-next-line no-console
      console.log('Received message from background:', JSON.stringify(response));
      window.postMessage({
        from: 'EthereumWebWalletResponse',
        id: event.data.id,
        response,
      });
    });
  }
});
