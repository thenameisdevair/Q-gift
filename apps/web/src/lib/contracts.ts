export const QGIFT_ADDRESS = "0x40688b93c34312DbB95745fB8879b02386615991" as const;
export const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;

export const QGIFT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "string", name: "occasion", type: "string" },
      { internalType: "string", name: "message", type: "string" },
    ],
    name: "sendGift",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const CUSD_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
