import api from "./api";

// POST /api/links – create short link
export async function createLink(data) {
  const res = await api.post("/api/links", data);
    return res.data;
}

// GET /api/links – list all links
export async function getLinks() {
  const res = await api.get("/api/links");
    return res.data;
}

// GET /api/links/:code – stats for one short code
export async function getLinkStats(code) {
  const res = await api.get(`/api/links/${code}`);
    return res.data;
}

// DELETE /api/links/:code
export async function deleteLink(code) {
  const res = await api.delete(`/api/links/${code}`);
    return res.data;
}
