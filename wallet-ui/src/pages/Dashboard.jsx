import { useEffect, useState } from "react";
import { useWallet } from "../store/WalletContext";
import { useNavigate } from "react-router-dom";
import { getBalance } from "../rpc/balance";
import { getTokenBalance } from "../rpc/token";
import { ethers } from "ethers";

export default function Dashboard() {
  const { privateKey } = useWallet();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalances, setTokenBalances] = useState({});

  // 🔐 Route protection
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

    fetchEthBalance(parsed.address);

    if (parsed.tokens && parsed.tokens.length > 0) {
      fetchTokenBalances(parsed.tokens, parsed.address);
    }
  }, [privateKey, navigate]);

  // 🔵 Fetch ETH balance
  async function fetchEthBalance(address) {
    try {
      const bal = await getBalance(address);
      setEthBalance(bal);
    } catch (err) {
      console.error("ETH balance error:", err);
    }
  }

  // 🪙 Fetch all token balances
  async function fetchTokenBalances(tokens, address) {
    const balances = {};

    for (let token of tokens) {
      try {
        const raw = await getTokenBalance(token.address, address);
        balances[token.address] = ethers.formatUnits(
          raw,
          token.decimals
        );
      } catch (err) {
        console.error("Token balance error:", err);
        balances[token.address] = "0";
      }
    }

    setTokenBalances(balances);
  }

  if (!wallet) return null;

  return (
    <div>
      <h2>Dashboard</h2>

      <p><strong>Address:</strong> {wallet.address}</p>
      <p><strong>ETH Balance:</strong> {ethBalance} ETH</p>

      <br />

      <button onClick={() => navigate("/send")}>
        Send ETH
      </button>

      <button onClick={() => navigate("/add-token")}>
        Add Token
      </button>

      <br /><br />

      {/* 🪙 Token Section */}
      <h3>Tokens</h3>

      {wallet.tokens && wallet.tokens.length > 0 ? (
        wallet.tokens.map((token, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <p>
              <strong>{token.symbol}</strong>:{" "}
              {tokenBalances[token.address] || "Loading..."}
            </p>

            <button
              onClick={() => navigate(`/send-token/${token.address}`)}
            >
              Send {token.symbol}
            </button>
          </div>
        ))
      ) : (
        <p>No tokens added</p>
      )}

      <br />

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