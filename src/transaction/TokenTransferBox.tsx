import { TransactionRequest } from '@ethersproject/abstract-provider';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import React from 'react';
import UserState from '../common/UserState';
import { getTransferLogs, TokenTransfer } from './LogTracer';

interface TokenTransferProps {
  tx: TransactionRequest;
}

export interface TokenTransferBox {
  state: {
    tokenTransfers: Array<TokenTransfer>;
    tx: TransactionRequest;
  },
  props: TokenTransferProps;
}

export class TokenTransferBox extends React.Component<TokenTransferProps> {
  constructor(props: TokenTransferProps) {
    super(props);
    this.state = {
      tokenTransfers: Array<TokenTransfer>(),
      tx: props.tx,
    };
    this.load();
  }

  async load() {
    const { tx } = this.state;
    const provider = await UserState.getProvider();
    if (provider !== null && (provider as JsonRpcProvider) !== undefined) {
      const transfers: Array<TokenTransfer> = await getTransferLogs(
        provider as JsonRpcProvider,
        tx,
      );
      this.setState({
        tokenTransfers: transfers,
      });
    }
  }

  render() {
    const tokenTransferArray: Array<JSX.Element> = [];
    const { tokenTransfers } = this.state;
    for (let i = 0; i < tokenTransfers.length; i += 1) {
      const tokenTransfer = tokenTransfers[i];
      tokenTransferArray.push(
        <p>
          Transfer from
          {' '}
          {tokenTransfer.from}
          {' '}
          to
          {' '}
          {tokenTransfer.to}
          {' '}
          for
          {' '}
          <b>{ethers.utils.formatEther(tokenTransfer.amount)}</b>
          {' '}
          of token
          {' '}
          {tokenTransfer.token}
        </p>,
      );
    }
    return (
      <div>
        {tokenTransferArray}
      </div>
    );
  }
}
