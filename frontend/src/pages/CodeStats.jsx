import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLinkStats, deleteLink } from "../services/links";

export default function CodeStats() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, [code]);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getLinkStats(code);
      setStats(data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this link?")) return;

    try {
      await deleteLink(code);
      navigate("/");
    } catch (err) {
      alert("Failed to delete link");
    }
  }

  if (loading) return <p>Loading stats…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1>Stats for Code: {code}</h1>

      <p>
        <Link to="/">← Back to Dashboard</Link>
      </p>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Short URL:</strong> {window.location.origin + "/" + code}</p>
        <p><strong>Target URL:</strong> <a href={stats.target_url} target="_blank">{stats.target_url}</a></p>
        <p><strong>Clicks:</strong> {stats.click_count}</p>
        <p><strong>Created:</strong> {new Date(stats.created_at).toLocaleString()}</p>

        {stats.last_clicked_at && (
          <p><strong>Last Clicked:</strong> {new Date(stats.last_clicked_at).toLocaleString()}</p>
        )}
      </div>

      <button
        onClick={handleDelete}
        style={{ marginTop: "20px", padding: "8px 16px", background: "red", color: "white" }}
      >
        Delete Link
      </button>
    </div>
  );
}
