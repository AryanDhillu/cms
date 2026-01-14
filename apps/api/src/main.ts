import "dotenv/config";
import express from 'express';
import catalogRoutes from "./routes/catalog.routes";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 🔑 THIS LINE ENABLES /catalog/*
app.use("/catalog", catalogRoutes);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
