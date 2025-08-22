import { useEffect, useMemo, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        if (!cancelled) {
          setUsers(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q)
    );
  }, [query, users]);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
      <h1 style={{ marginBottom: 8 }}>Users (JSONPlaceholder)</h1>

      {/* 検索フォーム */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="name / username / email で検索"
          style={{ padding: 8, width: 360, maxWidth: "100%" }}
        />
      </div>

      {/* 状態ごとの分岐表示 */}
      {loading && <p>Loading...</p>}
      {error && (
        <p style={{ color: "crimson" }}>
          Error: {error}（ネットワーク・CORS・一時的な障害など）
        </p>
      )}

      {!loading && !error && (
        <>
          <p style={{ fontSize: 14, color: "#666" }}>
            Showing {filtered.length} / {users.length}
          </p>
          <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
            {filtered.map((u) => (
              <li key={u.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                <div style={{ fontWeight: 600 }}>{u.name} <span style={{ color: "#666" }}>@{u.username}</span></div>
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
