import "dotenv/config";
import express from 'express';
import catalogRoutes from "./routes/catalog.routes";
import meRouter from "./routes/me.route";
import cmsRouter from "./routes/cms.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 🔑 THIS LINE ENABLES /catalog/*
app.use("/catalog", catalogRoutes);

app.use("/cms", meRouter);
// app.use("/cms/admin", adminRoutes); // This was potentially conflicting with cmsRouter which also defines /admin/users
// Instead, let's keep it simple. cmsRouter has /admin/users defined.
// Using adminRoutes file for /cms/admin/users means we should mount it carefully.

// app.use("/cms/admin", adminRoutes); 
// COMMENTED OUT TO FIX CONFLICT. 
// cmsRouter ALREADY defines /admin/users. 
// Having both causes routing ambiguity/priority issues.
// We will rely on cmsRouter for now as it was working in previous steps.

app.use("/cms", cmsRouter);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

