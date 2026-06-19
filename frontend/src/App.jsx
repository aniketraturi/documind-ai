import { useState } from "react";
import { apiClient } from "./api/client";

function App() {
  const [backendStatus, setBackendStatus] = useState("Not checked yet");
  const [loading, setLoading] = useState(false);

  const checkBackendHealth = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/health");
      setBackendStatus(response.data.status);
    } catch (error) {
      console.error(error);
      setBackendStatus("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="mb-2 text-sm font-medium text-cyan-400">
          DocuMind AI
        </p>

        <h1 className="text-3xl font-bold tracking-tight">
          Enterprise AI Knowledge Base
        </h1>

        <p className="mt-4 text-slate-300">
          Frontend setup is working. Now let&apos;s verify that React can talk
          to the FastAPI backend.
        </p>

        <div className="mt-6 rounded-xl bg-slate-950 p-4 border border-slate-800">
          <p className="text-sm text-slate-400">Backend status</p>
          <p className="mt-1 text-lg font-semibold">{backendStatus}</p>
        </div>

        <button
          onClick={checkBackendHealth}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Backend Health"}
        </button>
      </div>
    </main>
  );
}

export default App;