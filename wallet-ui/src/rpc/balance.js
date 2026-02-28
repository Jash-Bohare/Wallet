import { provider } from "./provider";

export async function getBalance(address) {
  const balance = await provider.getBalance(address);
  return Number(balance) / 1e18;
}