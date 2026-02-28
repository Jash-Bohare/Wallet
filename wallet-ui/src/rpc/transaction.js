import { ethers } from "ethers";
import { provider } from "./provider";

// 1️⃣ Fetch Nonce
export async function getNonce(address) {
  return await provider.getTransactionCount(address);
}

// 2️⃣ Fetch Gas Data (EIP-1559)
export async function getGasData() {
  const feeData = await provider.getFeeData();

  return {
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
  };
}

// 3️⃣ Estimate Gas
export async function estimateGas(tx) {
  return await provider.estimateGas(tx);
}

// 4️⃣ Broadcast
export async function broadcastTx(signedTx) {
  return await provider.broadcastTransaction(signedTx);
}