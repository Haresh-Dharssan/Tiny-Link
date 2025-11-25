import { useEffect, useState } from "react";
import { createLink, getLinks, deleteLink } from "../services/links";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all links on page load
  useEffect(() => {
  loadLinks();

  // auto refresh every 3 seconds
    const interval = setInterval(() => {
        loadLinks();
    }, 3000);

    return () => clearInterval(interval);
    }, []);

  async function loadLinks() {
    try {
      const data = await getLinks();
      setLinks(data.links || []);
    } catch (err) {
      console.error("Failed to load links:", err);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createLink({
        url,
        customCode: customCode || undefined
      });

      setUrl("");
      setCustomCode("");

      await loadLinks();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create link");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(code) {
    if (!confirm("Delete this link?")) return;

    try {
      await deleteLink(code);
      await loadLinks();
    } catch (err) {
      alert("Failed to delete link");
      console.error(err);
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>TinyLink Dashboard</h1>

      {/* Create link form */}
      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ width: "60%", padding: "8px" }}
        />

        <input
          type="text"
          placeholder="Custom code (optional)"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          style={{ width: "30%", padding: "8px", marginLeft: "10px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ marginLeft: "10px", padding: "8px 16px" }}
        >
          {loading ? "Creating..." : "Shorten"}
        </button>
      </form>

      {/* Links table */}
      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Short Code</th>
            <th>Target URL</th>
            <th>Clicks</th>
            <th>Last Clicked</th>
            <th>Created</th>
            <th>View</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody> 
          {links.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No links found
              </td>
            </tr>
          ) : (
            links.map((link) => (
              <tr key={link.id}>
                <td>
                  <a href={`/code/${link.short_code}`}>
                    {link.short_code}
                  </a>
                </td>
                <td>
                  <a href={link.target_url} target="_blank">
                    {link.target_url}
                  </a>
                </td>
                <td>{link.click_count}</td>
                <td>
                {link.last_clicked_at
                    ? new Date(link.last_clicked_at).toLocaleString()
                    : "—"}
                </td>
                <td>{new Date(link.created_at).toLocaleString()}</td>
                <td>
                    <button
                        onClick={() => window.open(`${import.meta.env.VITE_API_URL}/${link.short_code}`, "_blank")}
                        style={{ marginRight: "10px" }}
                    >
                        View
                    </button>
                </td>
                <td>
                    <button onClick={() => handleDelete(link.short_code)}>
                        Delete
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
