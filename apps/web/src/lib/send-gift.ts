"use client";

import {
  createPublicClient,
  createWalletClient,
  custom,
  encodeFunctionData,
  http,
  parseUnits,
} from "viem";
import { celo } from "viem/chains";
import { CUSD_ABI, CUSD_ADDRESS, QGIFT_ABI, QGIFT_ADDRESS } from "./contracts";

export type SendGiftArgs = {
  recipient: `0x${string}`;
  amount: string;
  occasion: string;
  message: string;
};

export async function sendGift({
  recipient,
  amount,
  occasion,
  message,
}: SendGiftArgs): Promise<`0x${string}`> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet provider available.");
  }

  const publicClient = createPublicClient({
    chain: celo,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: celo,
    transport: custom(window.ethereum as unknown as Parameters<typeof custom>[0]),
  });

  const [address] = await walletClient.getAddresses();
  if (!address) throw new Error("No wallet account.");
  const amountWei = parseUnits(amount, 18);

  const approveTxHash = await walletClient.sendTransaction({
    account: address,
    to: CUSD_ADDRESS,
    data: encodeFunctionData({
      abi: CUSD_ABI,
      functionName: "approve",
      args: [QGIFT_ADDRESS, amountWei],
    }),
    feeCurrency: CUSD_ADDRESS,
  } as Parameters<typeof walletClient.sendTransaction>[0]);

  await publicClient.waitForTransactionReceipt({ hash: approveTxHash });

  const sendGiftData = encodeFunctionData({
    abi: QGIFT_ABI,
    functionName: "sendGift",
    args: [recipient, amountWei, occasion, message],
  });

  const gasLimit = await publicClient.estimateGas({
    account: address,
    to: QGIFT_ADDRESS,
    data: sendGiftData,
  });

  const giftTxHash = await walletClient.sendTransaction({
    account: address,
    to: QGIFT_ADDRESS,
    data: sendGiftData,
    gas: gasLimit,
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: giftTxHash,
  });

  if (receipt.status !== "success") {
    throw new Error("sendGift transaction reverted.");
  }

  return giftTxHash;
}
