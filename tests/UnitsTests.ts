import { expect } from 'chai';
import { BigNumber, ethers } from 'ethers';
import { formatETHCost, log10, log2 } from '../src/Units';

describe('Units', () => {
  it('Computes the log2 of a BigNumber', () => {
    const vals = [[0, 0], [1, 0], [2, 1], [3, 1], [4, 2], [6, 2], [7, 2], [8, 3], [16, 4],
      [18, 4], [31, 4], [32, 5],
      [127, 6], [128, 7], [129, 7], [255, 7], [256, 8], [BigNumber.from(10).pow(16), 53],
      [BigNumber.from(10).pow(160), 531], [BigNumber.from(2).pow(256).sub(1), 255],
      [BigNumber.from(2).pow(256), 256]];
    for (let i = 0; i < vals.length; i += 1) {
      expect(log2(BigNumber.from(vals[i][0])), vals[i].toString()).to.equal(vals[i][1]);
    }
  });
  it('Computes the log10 of a BigNumber', () => {
    const vals = [[0, 0], [1, 0], [6, 0], [8, 0], [9, 0], [10, 1], [16, 1], [19, 1],
      [66, 1], [99, 1], [100, 2], [128, 2], [199, 2], [999, 2], [1000, 3],
      [BigNumber.from(10).pow(16).sub(1), 15],
      [BigNumber.from(10).pow(16), 16], [BigNumber.from(10).pow(160).sub(1), 159],
      [BigNumber.from(10).pow(160), 160], [BigNumber.from(2).pow(256), 77]];
    for (let i = 0; i < vals.length; i += 1) {
      expect(log10(BigNumber.from(vals[i][0])), vals[i].toString()).to.equal(vals[i][1]);
    }
  });
  it('Formats ETH costs', () => {
    expect(formatETHCost(ethers.utils.parseEther('1.0'), 5, 5)).to.equal('1.0');
    expect(formatETHCost(ethers.utils.parseEther('1.0000001'), 5, 5)).to.equal('1.0000001');
    expect(formatETHCost(ethers.utils.parseEther('1.000000001'), 5, 5)).to.equal('1.000000001');
    expect(formatETHCost(ethers.utils.parseEther('1.000000001'), 5, 10)).to.equal('1.0');
    expect(formatETHCost(ethers.utils.parseEther('1.123456789123456789'), 5, 10)).to.equal('1.12345678');
    expect(formatETHCost(ethers.utils.parseEther('1.123456789123456789'), 5, 18)).to.equal('1.12345');
    expect(formatETHCost(ethers.utils.parseEther('1.123456789123456789'), 6, 18)).to.equal('1.123456');
    expect(formatETHCost(ethers.utils.parseEther('0.000000000000123456'), 6, 18))
      .to.equal('0.000000000000123456');
    expect(formatETHCost(ethers.utils.parseEther('0.000123456'), 6, 13)).to.equal('0.000123456');
    expect(formatETHCost(ethers.utils.parseEther('0.000123456'), 2, 13)).to.equal('0.000123');
    expect(formatETHCost(ethers.utils.parseEther('123456789.000123456'), 2, 18)).to.equal('123456789.0');
    expect(formatETHCost(ethers.utils.parseEther('123456789.000123456'), 2, 20)).to.equal('123456700.0');
  });
});
