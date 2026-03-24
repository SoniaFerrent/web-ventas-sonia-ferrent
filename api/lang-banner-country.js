module.exports = function handler(req, res) {
  const country = req.headers["x-vercel-ip-country"] || "";

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ country });
};
