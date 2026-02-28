import { useEffect, useState } from "react";
import { useWallet } from "../store/WalletContext";
import { useNavigate } from "react-router-dom";
import { getBalance } from "../rpc/balance";

export default function Dashboard() {
  const { privateKey } = useWallet();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const stored = localStorage.getItem("wallet");

    if (!stored) {
      navigate("/");
      return;
    }

    if (!privateKey) {
      navigate("/unlock");
      return;
    }

    const parsed = JSON.parse(stored);
    setWallet(parsed);

    fetchBalance(parsed.address);
  }, [privateKey, navigate]);

  async function fetchBalance(address) {
    try {
      const bal = await getBalance(address);
      setBalance(bal);
    } catch (err) {
      console.error("Balance fetch error:", err);
    }
  }

  if (!wallet) return null;

  return (
    <div>
      <h2>Dashboard</h2>

      <p><strong>Address:</strong> {wallet.address}</p>
      <p><strong>Balance:</strong> {balance} ETH</p>

      <br />

      <button onClick={() => navigate("/send")}>
        Send ETH
      </button>

      <button
        onClick={() => {
          localStorage.removeItem("wallet");
          navigate("/");
        }}
      >
        Delete Wallet
      </button>
    </div>
  );
}