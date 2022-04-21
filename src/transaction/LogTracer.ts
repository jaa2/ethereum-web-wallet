import { JsonRpcProvider, TransactionRequest } from '@ethersproject/providers';
import {
  BigNumber, BigNumberish, BytesLike, ethers,
} from 'ethers';

function bufferToHexString(buffer: any) {
  const arr = Object.keys(buffer).map((x) => buffer[x]);
  const asbn = ethers.BigNumber.from(arr);
  return ethers.utils.hexZeroPad(asbn.toHexString(), arr.length);
}

/**
 * Encodes a number for use in debug_traceCall
 * @param number Number to encode
 * @returns Hex-encoded number with any highest-order zeros stripped
 */
function numberToHexString(number: BigNumberish) {
  const bn = BigNumber.from(number);
  let hexString = ethers.utils.hexStripZeros(bn.toHexString());
  if (ethers.utils.hexDataLength(hexString) === 0) {
    // All zeros were stripped, so add one back
    hexString = '0x0';
  }
  return hexString;
}

export interface TokenTransfer {
  from: string,
  to: string,
  token: string,
  tokenIconURL?: string,
  amount: BigNumber
}

interface TransactionCallObject {
  from?: string,
  to?: string,
  gas?: BigNumberish,
  gasPrice?: BigNumberish,
  value?: BigNumberish,
  data?: BytesLike
}

export async function getTransferLogs(provider: JsonRpcProvider, request: TransactionRequest):
Promise<Array<TokenTransfer>> {
  const fault = 'function(log) {}';
  const step = `function(log) {
    if (log.op.toString().startsWith('LOG')) {
        /* Get number of topics */
        var numTopics = log.op.toString().substring(3, 4);
        var topics = [];
        for (var i = 0; i < numTopics; i++) {
            topics.push(log.stack.peek(2 + i));
        }

        this.data.push({
            address: log.contract.getAddress(),
            topics: topics,
            data: log.memory.slice(Number(log.stack.peek(0)), Number(log.stack.peek(0) + log.stack.peek(1)))
        });
    }
  }`;

  const funcResult = `function() {
      return this.data;
  }`;

  let tracer = `{data: [], fault: ${fault}, step: ${step}, result: ${funcResult}}`;
  tracer = tracer.replaceAll('\r', '').replaceAll('\n', '');

  console.log(tracer); // eslint-disable-line

  const txObj: TransactionCallObject = {};
  if (request.from) {
    txObj.from = request.from;
  }
  if (request.to) {
    txObj.to = request.to;
  }
  if (request.gasLimit) {
    txObj.gas = numberToHexString(request.gasLimit);
  }
  if (request.gasPrice) {
    txObj.gasPrice = numberToHexString(request.gasPrice);
  }
  if (request.value) {
    txObj.value = numberToHexString(request.value);
  }
  if (request.data) {
    txObj.data = request.data;
  }

  const result = await provider.send('debug_traceCall', [txObj, 'latest', { tracer: tracer.toString() }]);

  const transfers: Array<TokenTransfer> = [];

  // Clean result
  for (let i = 0; i < result.length; i += 1) {
    result[i].topics = result[i].topics.map((x: Number) => ethers.BigNumber.from(x).toHexString());

    if (result[i].topics.length === 3) {
      if (result[i].topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
        // Pad addresses
        for (let j = 1; j < 3; j += 1) {
          result[i].topics[j] = ethers.utils.hexZeroPad(result[i].topics[j], 20);
        }

        // eslint-disable-next-line no-console
        console.log(
          'Transfer from',
          ethers.utils.getAddress(result[i].topics[1]),
          'to',
          ethers.utils.getAddress(result[i].topics[2]),
          'for token',
          bufferToHexString(result[i].address),
        );
        transfers.push({
          from: ethers.utils.getAddress(result[i].topics[1]),
          to: ethers.utils.getAddress(result[i].topics[2]),
          token: ethers.utils.getAddress(bufferToHexString(result[i].address)),
          amount: BigNumber.from(bufferToHexString(result[i].data)),
        });
      }
    }
  }

  return transfers;
}
