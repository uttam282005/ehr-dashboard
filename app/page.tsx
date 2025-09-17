"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TokenForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Fetching...");

    try {
      const resp = await fetch("/api/get-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, apiKey }),
      });

      const data = await resp.json();

      if (resp.ok) {
        setMessage("✅ Tokens stored in localStorage");
        router.push("/home")
      } else {
        setMessage("❌ " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching tokens");
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4">Fetch EHR Tokens</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="API Key"
          className="w-full border p-2 rounded"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <input
          placeholder="Username"
          className="w-full border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded"
        >
          Get Tokens
        </button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}

