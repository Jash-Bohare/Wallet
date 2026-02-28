import { ethers } from "ethers";

const RPC_URL = "https://sepolia.infura.io/v3/637f3ed9f4364454a1cb9e5d0627c2fa";

export const provider = new ethers.JsonRpcProvider(RPC_URL);