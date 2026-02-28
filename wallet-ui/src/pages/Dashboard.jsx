import { useEffect, useState } from "react";

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("wallet");
    if (stored) setWallet(JSON.parse(stored));
  }, []);

  if (!wallet) return <div>No wallet found</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Address: {wallet.address}</p>
      <p>Balance: {wallet.balance} ETH</p>
    </div>
  );
}