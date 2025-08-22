import { useEffect, useMemo, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(API_URL);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        if (!cancelled) setUsers(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/hello"); // デプロイ先でOK
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        setMessage(data.message);
      } catch (e) {
        setMessage(`Error: ${e.message}`);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    const norm = v => String(v ?? "").toLowerCase();
    return users.filter(u =>
      norm(u.name).includes(q) ||
      norm(u.username).includes(q) ||
      norm(u.email).includes(q) ||
      norm(u.phone).includes(q)
    );
  }, [query, users]);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Users (JSONPlaceholder)</h1>
      <h2>{message}</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="name / username / email / phone で検索"
          style={{ padding: 8, width: 360, maxWidth: "100%" }}
          disabled={loading}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <p style={{ fontSize: 14, color: "#666" }}>
            Showing {filtered.length} / {users.length}
          </p>
          <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
            {filtered.map((u) => (
              <li key={u.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                <div style={{ fontWeight: 600 }}>
                  {u.name} <span style={{ color: "#666" }}>@{u.username}</span>
                </div>
                <div>{u.email}</div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {u.address?.city} / {u.company?.name}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
