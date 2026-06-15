import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "atoms_cloud_db.json");

app.use(express.json());

// Initialize local JSON file database for AtomsCloud
function readDB(): Record<string, any> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading AtomsCloud DB", e);
  }
  return {};
}

function writeDB(data: Record<string, any>) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing AtomsCloud DB", e);
  }
}

// REST endpoints for AtomsCloud
app.get("/api/atomscloud/:key", (req, res) => {
  const { key } = req.params;
  const db = readDB();
  res.json({ val: db[key] || null });
});

app.post("/api/atomscloud/:key", (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  const db = readDB();
  db[key] = value;
  writeDB(db);
  res.json({ success: true, key, value });
});

// Vite middleware for development or fallback for production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
