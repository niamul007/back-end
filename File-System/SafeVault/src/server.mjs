import express from 'express';
import clientRoutes from './routes/clientRoutes.mjs';
import { initStorage } from './models/clientModel.mjs';

const app = express();
const PORT = 3000;

// --- 1. MIDDLEWARE ---
// This allows the server to read the JSON data sent from the frontend
app.use(express.json());

// This serves your index.html, style.css, and script.js automatically
app.use(express.static('public'));

// --- 2. ROUTES ---
// All your financial logic routes are now prefixed with /api
app.use('/api', clientRoutes);

// --- 3. INITIALIZATION & START ---
// We call initStorage to make sure the JSON file exists before the server starts
initStorage().then(() => {
    app.listen(PORT, () => {
        console.log(`🛡️ SafeVault Server running at http://localhost:${PORT}`);
    });

    
}).catch(err => {
    console.error("Failed to initialize system storage:", err);
});