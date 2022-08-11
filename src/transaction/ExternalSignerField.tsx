import { TransactionRequest } from '@ethersproject/providers';
import { BigNumber, ethers, Transaction } from 'ethers';
import React from 'react';

interface IExternalSignerFieldProps {
  tx: TransactionRequest;
  callback: (tx: Transaction) => void;
}

/**
 * Selects all text inside a textarea
 * @param event mouse event with textarea as target
 */
function textareaSelectAll(event: React.MouseEvent<Element>) {
  (event.currentTarget as HTMLTextAreaElement).select();
}

/**
 * Serialize a transaction request into a JSON string
 * @param tx TransactionRequest to serialize
 * @returns JSON representation of the transaction request with BigNumberish items turned
 *  into strings
 */
function serializeTransaction(tx: TransactionRequest): string {
  const tx2: any = tx;
  const keys = ['value', 'nonce', 'gasLimit', 'maxFeePerGas', 'maxPriorityFeePerGas'];
  for (let i = 0; i < keys.length; i += 1) {
    const item = keys[i];
    if (item in tx2) {
      tx2[item] = BigNumber.from(tx2[item]).toString();
    }
  }
  return JSON.stringify(tx2, null, '  ');
}

export default function ExternalSignerField(props: IExternalSignerFieldProps) {
  const { tx, callback } = props;
  const [isValidSignedTx, setIsValidSignedTx] = React.useState<boolean | undefined>(undefined);
  const [invalidReason, setInvalidReason] = React.useState<string | undefined>(undefined);
  let validSignedTxClassName = '';
  if (isValidSignedTx === true) {
    validSignedTxClassName = 'is-valid';
  } else if (isValidSignedTx === false) {
    validSignedTxClassName = 'is-invalid';
  }

  return (
    <div className="row container mt-2">
      <div className="col-6 text-center">
        <p>Transaction to sign</p>
        <textarea className="form-control" rows={5} readOnly onClick={textareaSelectAll} value={serializeTransaction(tx)} />
      </div>
      <div className="col-6 text-center">
        <p>Signed transaction</p>
        <textarea
          className={`form-control ${validSignedTxClassName}`}
          rows={5}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            let isSameTx = true;
            let isValidTx = false;
            try {
              const eventTx = ethers.utils.parseTransaction(event.target.value);
              isValidTx = true;
              isSameTx = [[eventTx.from === tx.from, 'Wrong sender address'],
                [eventTx.to === tx.to || (eventTx.to === null && tx.to === undefined), `Wrong destination address (got ${eventTx.to}, wanted ${tx.to})`],
                [eventTx.chainId === tx.chainId, `Wrong chain ID (got ${eventTx.chainId}, wanted ${tx.chainId})`],
                [eventTx.value.eq(tx.value ? tx.value : 0), `Wrong ETH value (got ${ethers.utils.formatEther(eventTx.value)} ETH)`],
                [BigNumber.from(eventTx.nonce).eq(tx.nonce ? tx.nonce : 0), `Wrong nonce (got ${eventTx.nonce}, wanted ${tx.nonce})`],
                [eventTx.data === tx.data, 'Wrong data bytes']].every((val: (string | boolean)[]) => {
                if (val[0] !== true && typeof val[1] === 'string') {
                  setInvalidReason(val[1]);
                }
                return val[0] === true;
              });
              if (isSameTx) {
                callback(eventTx);
              }
            } catch (e: any) {
              setInvalidReason(`Failed to parse raw transaction: ${e.message}`);
            }

            setIsValidSignedTx(isSameTx && isValidTx);
          }}
        />
        <div className="invalid-feedback">{invalidReason}</div>
      </div>
    </div>
  );
}
