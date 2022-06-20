import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

type Options = {
  amountIn: ethers.BigNumber;
  balanceIn: ethers.BigNumber;
  balanceOut: ethers.BigNumber;
  fee: {
    amount: ethers.BigNumber;
    decimals: number;
  };
  decimals: number;
};

const calculateSwapOut = ({
  amountIn,
  balanceIn,
  balanceOut,
  fee,
  decimals,
}: Options) => {
  if (balanceIn.lte(0)) {
    return '0';
  }

  const tenBigNumber = new BigNumber(10);
  const amountInBigNumber = new BigNumber(amountIn.toString());
  const balanceInBigNumber = new BigNumber(balanceIn.toString());
  const balanceOutBigNumber = new BigNumber(balanceOut.toString());

  const multiplier = tenBigNumber.pow(fee.decimals);
  const amountInWithFee = amountInBigNumber.times(
    multiplier.minus(fee.amount.toString()),
  );

  const amountOut = balanceOutBigNumber
    .times(amountInWithFee)
    .div(balanceInBigNumber.times(multiplier).plus(amountInWithFee))
    .toFixed(0);

  return formatUnits(amountOut.toString(), decimals);
};

export default calculateSwapOut;
