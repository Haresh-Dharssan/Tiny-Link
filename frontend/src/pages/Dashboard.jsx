import { useEffect, useState } from "react";
import { createLink, getLinks, deleteLink } from "../services/links";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [query, setQuery] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    try {
      setLoading(true);
      const data = await getLinks();
      setLinks(data.links || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    if (!url.startsWith("http")) {
      setError("URL must start with http:// or https://");
      setCreating(false);
      return;
    }

    try {
      await createLink({ url, customCode: customCode || undefined });
      setUrl("");
      setCustomCode("");
      setSuccess("Short link created successfully!");
      loadLinks();
      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to create link.");
    } finally {
      setCreating(false);
    }
  }

  const filtered = links.filter((l) =>
    l.short_code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-10">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your short links
        </p>
      </div>

      {/* CREATE LINK CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Create New Link</h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-3 border">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-3 border">
            {success}
          </div>
        )}

        <form onSubmit={handleCreate} className="grid gap-4">

          <input
            className="px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter a long URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            className="px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Custom code (optional)"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
          />

          <button
            disabled={creating}
            className="bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {creating ? "Creating..." : "Generate Link"}
          </button>
        </form>
      </div>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by code…"
        className="px-4 py-3 border rounded-xl shadow-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* LINKS TABLE */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Target URL</th>
              <th className="p-4 text-left">Clicks</th>
              <th className="p-4 text-left">Last Click</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No links found.
                </td>
              </tr>
            ) : (
              filtered.map((link) => (
                <tr
                  key={link.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-red-600">
                    <Link to={`/code/${link.short_code}`}>
                      {link.short_code}
                    </Link>
                  </td>

                  <td className="p-4 max-w-[180px] sm:max-w-[280px] md:max-w-[380px] truncate">
                    {link.target_url}
                  </td>

                  <td className="p-4">{link.click_count}</td>

                  <td className="p-4">
                    {link.last_clicked_at
                      ? new Date(link.last_clicked_at).toLocaleString()
                      : "—"}
                  </td>

                  <td className="p-4 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${import.meta.env.VITE_API_URL}/${link.short_code}`
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() =>
                        window.open(
                          `${import.meta.env.VITE_API_URL}/${link.short_code}`,
                          "_blank"
                        )
                      }
                      className="text-green-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteLink(link.short_code).then(loadLinks)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}
