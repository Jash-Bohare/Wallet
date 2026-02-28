import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Wallet</h1>
      <button onClick={() => navigate("/create")}>
        Create New Wallet
      </button>
    </div>
  );
}