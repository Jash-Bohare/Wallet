import { ethers } from "ethers";
import { provider as defaultProvider } from "./provider";

// Fetch Nonce
export async function getNonce(address: string, provider: ethers.Provider = defaultProvider): Promise<number> {
  return await provider.getTransactionCount(address);
}

// Fetch Gas Data (EIP-1559)
export async function getGasData(provider: ethers.Provider = defaultProvider): Promise<{
  maxFeePerGas: bigint | null;
  maxPriorityFeePerGas: bigint | null;
  gasPrice: bigint | null;
}> {
  const feeData = await provider.getFeeData();
  const fallbackGasPrice = feeData.gasPrice || 1000000000n; // Use gasPrice from feeData or 1 gwei fallback

  return {
    maxFeePerGas: feeData.maxFeePerGas || feeData.gasPrice || fallbackGasPrice,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || 1000000000n,
    gasPrice: feeData.gasPrice || fallbackGasPrice
  };
}

// Estimate Gas
export async function estimateGas(tx: any, provider: ethers.Provider = defaultProvider): Promise<bigint> {
  return await provider.estimateGas(tx);
}

// Broadcast (Helper that signs and sends)
export async function broadcastTx(
  privateKey: string,
  tx: any,
  provider: ethers.Provider = defaultProvider
): Promise<ethers.TransactionResponse> {
  const wallet = new ethers.Wallet(privateKey, provider);
  return await wallet.sendTransaction(tx);
}
