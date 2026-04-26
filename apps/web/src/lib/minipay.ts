"use client";

type Eip1193 = {
  isMiniPay?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: Eip1193;
  }
}

export function isMiniPay(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.ethereum?.isMiniPay);
}

export async function requestMiniPayAddress(): Promise<`0x${string}` | null> {
  if (!isMiniPay()) return null;
  const accounts = (await window.ethereum!.request({
    method: "eth_requestAccounts",
  })) as string[] | undefined;
  return (accounts?.[0] as `0x${string}` | undefined) ?? null;
}
