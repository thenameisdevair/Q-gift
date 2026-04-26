"use client";

import { createWalletClient, custom, encodeFunctionData, parseUnits } from "viem";
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
  const walletClient = createWalletClient({
    chain: celo,
    transport: custom(window.ethereum as unknown as Parameters<typeof custom>[0]),
  });
  const [address] = await walletClient.getAddresses();
  if (!address) throw new Error("No wallet account.");
  const amountWei = parseUnits(amount, 18);

  await walletClient.sendTransaction({
    account: address,
    to: CUSD_ADDRESS,
    data: encodeFunctionData({
      abi: CUSD_ABI,
      functionName: "approve",
      args: [QGIFT_ADDRESS, amountWei],
    }),
    feeCurrency: CUSD_ADDRESS,
    type: "legacy",
  } as Parameters<typeof walletClient.sendTransaction>[0]);

  const hash = await walletClient.sendTransaction({
    account: address,
    to: QGIFT_ADDRESS,
    data: encodeFunctionData({
      abi: QGIFT_ABI,
      functionName: "sendGift",
      args: [recipient, amountWei, occasion, message],
    }),
    feeCurrency: CUSD_ADDRESS,
    type: "legacy",
  } as Parameters<typeof walletClient.sendTransaction>[0]);

  return hash;
}
