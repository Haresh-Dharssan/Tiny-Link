import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLinkStats, deleteLink } from "../services/links";

export default function CodeStats() {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getLinkStats(code)
      .then((data) => setStats(data.data))
      .catch(() => setError("Failed to load stats"));
  }, [code]);

  if (error)
    return <p className="text-red-600 text-center">{error}</p>;

  if (!stats)
    return <p className="text-center text-gray-500">Loading stats...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <h1 className="text-2xl flex justify-center font-semibold">Stats for {code}</h1>

      <button
        onClick={() => window.location.href = "/"}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
      >
        ← Back to Dashboard
      </button>

      <div className="space-y-2">
        <p><b>Short URL:</b> {" "}
          <a href={ import.meta.env.VITE_API_URL+ "/" + code} className="text-blue-600" target="_blank">
            {import.meta.env.VITE_API_URL+ "/" + code}
          </a>
        </p>
        <p>
          <b>Target URL:</b>{" "}
          <a href={stats.target_url} className="text-blue-600" target="_blank">
            {stats.target_url}
          </a>
        </p>
        <p><b>Clicks:</b> {stats.click_count}</p>
        <p>
          <b>Created:</b>{" "}
          {new Date(stats.created_at).toLocaleString()}
        </p>
        <p>
          <b>Last Click:</b>{" "}
          {stats.last_clicked_at
            ? new Date(stats.last_clicked_at).toLocaleString()
            : "—"}
        </p>
      </div>

      <button
        onClick={() => deleteLink(code).then(() => (window.location.href = "/"))}
        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
      >
        Delete Link
      </button>
    </div>
  );
}
