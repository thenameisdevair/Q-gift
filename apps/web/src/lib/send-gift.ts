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
import { CUSD_ADDRESS } from "./contracts";

export type SendGiftArgs = {
  recipient: `0x${string}`;
  amount: string;
  occasion: string;
  message: string;
};

export async function sendGift({
  recipient,
  amount,
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

  const transferTxHash = await walletClient.sendTransaction({
    account: address,
    to: CUSD_ADDRESS as `0x${string}`,
    data: encodeFunctionData({
      abi: [
        {
          inputs: [
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "transfer",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      functionName: "transfer",
      args: [recipient, amountWei],
    }),
    feeCurrency: CUSD_ADDRESS as `0x${string}`,
    gas: 100000n,
  } as Parameters<typeof walletClient.sendTransaction>[0]);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transferTxHash,
  });

  if (receipt.status !== "success") {
    throw new Error("Gift transfer failed");
  }

  return transferTxHash;
}
