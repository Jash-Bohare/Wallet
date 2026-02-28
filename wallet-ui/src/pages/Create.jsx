import { useState } from "react";
import { generateMnemonic, derivePrivateKey, privateKeyToAddress } from "../core/wallet";
import { getBalance } from "../rpc/balance";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [mnemonic, setMnemonic] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleGenerate() {
    const m = generateMnemonic();
    setMnemonic(m);
  }

  async function handleContinue() {
    setLoading(true);

    const pk = await derivePrivateKey(mnemonic);
    const address = privateKeyToAddress(pk);
    const balance = await getBalance(address);

    localStorage.setItem(
      "wallet",
      JSON.stringify({
        mnemonic,
        address,
        balance
      })
    );

    setLoading(false);
    navigate("/dashboard");
  }

  return (
    <div>
      <h2>Create Wallet</h2>

      {!mnemonic && (
        <button onClick={handleGenerate}>
          Generate Wallet
        </button>
      )}

      {mnemonic && (
        <>
          <h3>Your Secret Recovery Phrase</h3>
          <p style={{ background: "#eee", padding: "10px" }}>
            {mnemonic}
          </p>

          <p>
            ⚠ Write this down. Anyone with this phrase can access your wallet.
          </p>

          <button onClick={handleContinue} disabled={loading}>
            {loading ? "Creating..." : "I Have Written It Down"}
          </button>
        </>
      )}
    </div>
  );
}